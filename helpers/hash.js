// https://github.com/adcpm/steemconnect.com/blob/dev/lib/utils.js
const crypto = require('crypto-js');

const encryptMessage = (message, secret) =>
  crypto.AES.encrypt(crypto.enc.Utf8.parse(message), secret).toString();

const decryptMessage = (message, secret) =>
  crypto.AES.decrypt(message, secret).toString(crypto.enc.Utf8);

module.exports = {
  encryptMessage,
  decryptMessage,
};
