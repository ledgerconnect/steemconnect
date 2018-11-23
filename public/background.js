/* global chrome */

const callbacks = {};

let state = null;
let url = null;

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
      const id = new Date().getTime();

      callbacks[id] = sendResponse;

      window.open(
        `index.html`,
        'extension_popup',
        'width=360,height=600,status=no,scrollbars=yes,resizable=no',
      );

      url = `/${request.payload}${request.payload.indexOf('?') === -1 ? '?' : '&'}requestId=${id}`;

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
