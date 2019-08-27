/* global chrome */

const MESSAGE_TAG = 'STEEMCONNECT_MESSAGE';

function respond(event, err, res) {
  window.postMessage(
    { tag: MESSAGE_TAG, messageId: event.data.messageId, type: 'response', err, res },
    window.location.origin,
  );
}

window.addEventListener(
  'message',
  event => {
    if (event.source !== window) return;
    if (event.data.tag !== MESSAGE_TAG) return;

    if ((['sign', 'login'].includes(event.data.type)) && event.data.payload) {
      chrome.runtime.sendMessage(
        { type: event.data.type, payload: event.data.payload },
        null,
        ([err, res]) => respond(event, err, res),
      );
    }

    if (event.data.type === 'open' && event.data.payload) {
      chrome.runtime.sendMessage({ type: 'open', payload: event.data.payload }, null);
    }
  },
  false,
);

document.addEventListener('DOMContentLoaded', () => {
  const el = document.createElement('script');
  el.src = chrome.extension.getURL('pagescript.js');
  (document.head || document.documentElement).appendChild(el);
});
