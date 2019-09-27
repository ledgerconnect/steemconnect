/* global chrome */

const WINDOW_WIDTH = 360;
const WINDOW_HEIGHT = 600;

const callbacks = {};

let state = null;
let url = null;

const popupIds = [];
const popupIdsToReqIds = {};

function openPopup(requestId) {
  popupIds.forEach(id => chrome.windows.remove(id));

  chrome.windows.getCurrent(chromeWindow => {
    const popupProperties = {
      state: 'normal',
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      left: chromeWindow.left + chromeWindow.width - WINDOW_WIDTH,
      top: chromeWindow.top,
    };

    chrome.windows.create(
      {
        url: 'index.html',
        type: 'popup',
        ...popupProperties,
      },
      ({ id }) => {
        popupIds.push(id);
        if (requestId) popupIdsToReqIds[id] = requestId;
        setTimeout(() => chrome.windows.update(id, popupProperties), 300);
      },
    );
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'store':
      state = request.payload;
      sendResponse(true);

      return false;
    case 'retrieve':
      sendResponse({
        state,
        url,
      });

      url = null;
      return false;
    case 'sign': {
      const requestId = new Date().getTime();
      callbacks[requestId] = sendResponse;

      const payload = request.payload.replace('steem://', '');
      url = `/${payload}${payload.indexOf('?') === -1 ? '?' : '&'}requestId=${requestId}`;

      openPopup(requestId);
      return true;
    }
    case 'login': {
      const requestId = new Date().getTime();
      callbacks[requestId] = sendResponse;

      const payload = { requestId };
      if (request.payload.authority)
        payload.authority = request.payload.authority;

      url = '/login-request' + (request.payload.app ? `/${request.payload.app}` : '')
        + '?' + Object.keys(payload)
          .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(payload[k])}`).join('&');

      openPopup(requestId);
      return true;
    }
    case 'open': {
      url = request.payload.replace('steem:/', '');
      openPopup();
      return true;
    }
    case 'signComplete':
      if (callbacks[request.payload.requestId])
        callbacks[request.payload.requestId](request.payload.args);
      return false;
    default:
      sendResponse(false);
      return false;
  }
});

chrome.windows.onRemoved.addListener((popupId) => {
  if (popupIdsToReqIds[popupId] && callbacks[popupIdsToReqIds[popupId]])
    callbacks[popupIdsToReqIds[popupId]](['Request rejected', null]);
});
