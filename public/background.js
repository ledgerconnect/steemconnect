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
    case 'sign': {
      debugger;

      window.open(
        `index.html`,
        'extension_popup',
        'width=360,height=600,status=no,scrollbars=yes,resizable=no',
      );

      setTimeout(() => {
        chrome.runtime.sendMessage(request);
      }, 100);

      sendResponse(true);
      break;
    }
    default:
      sendResponse(false);
  }
});
