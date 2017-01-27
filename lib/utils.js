const crypto = require('crypto-js');
const url = require('url');

function encryptMessage(message, secret) {
  return crypto.AES.encrypt(crypto.enc.Utf8.parse(message), secret).toString();
}

function decryptMessage(message, secret) {
  return crypto.AES.decrypt(message, secret).toString(crypto.enc.Utf8);
}

function isDifferentHost(origin) {
  let hostname = 'localhost';
  if (origin) {
    hostname = url.parse(origin).hostname;
  }
  return (hostname !== 'localhost' && hostname !== 'steemconnect.com' && hostname !== 'dev.steemconnect.com');
}

function parseJson(string) {
  let json;
  try {
    json = JSON.parse(string);
  } catch (e) {
    json = {};
  }
  return json;
}

module.exports = {
  encryptMessage,
  decryptMessage,
  isDifferentHost,
  parseJson,
};
