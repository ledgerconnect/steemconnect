/* eslint-disable no-underscore-dangle */

function API() {
  this.MESSAGE_TAG = 'STEEMCONNECT_MESSAGE';

  this.version = '0.1.5';
  this.callbacks = {};

  window.addEventListener('message', event => {
    if (event.source !== window) return;
    if (event.data.tag !== this.MESSAGE_TAG) return;

    if (event.data.type === 'response' && this.callbacks[event.data.messageId]) {
      this.callbacks[event.data.messageId](event.data.err, event.data.res);
    }
  });

  this.send = function send(type, payload, callback) {
    const messageId = new Date().getTime();

    window.postMessage({ tag: this.MESSAGE_TAG, messageId, type, payload }, window.location.origin);

    if (typeof callback === 'function') {
      this.callbacks[messageId] = callback;
    }
  };

  this.sign = (payload, callback) => this.send('sign', payload, callback);
  this.login = (payload, callback) => this.send('login', payload, callback);
  this.open = (payload) => this.send('open', payload);
}

window._steemconnect = new API();
