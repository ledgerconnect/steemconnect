/* global chrome */

let data = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.id) {
    case 'store':
      data = request.payload;
      sendResponse(true);
      break;
    case 'retrieve':
      sendResponse(data);
      break;
    default:
      sendResponse(false);
  }
});
