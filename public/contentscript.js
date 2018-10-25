/* global chrome */

window.addEventListener(
  'message',
  event => {
    if (event.source !== window) return;

    if (event.data.id && event.data.id === 'sign' && event.data.payload) {
      chrome.runtime.sendMessage({ id: 'sign', payload: event.data.payload });
    }
  },
  false,
);
