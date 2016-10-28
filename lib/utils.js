const crypto = require('crypto-js');

function encryptMessage(message, secret) {
  return crypto.AES.encrypt(crypto.enc.Utf8.parse(message), secret).toString();
}

function decryptMessage(message, secret) {
  return crypto.AES.decrypt(message, secret).toString(crypto.enc.Utf8);
}

module.exports = {
  encryptMessage,
  decryptMessage,
};
