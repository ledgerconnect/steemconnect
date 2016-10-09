const steem = require('steem');
const crypto = require('crypto-js');

function parseJSONMetadata(user) {
  let jsonMetadata = user.json_metadata;
  try {
    jsonMetadata = JSON.parse(jsonMetadata);
  } catch (e) {
    jsonMetadata = {};
  }
  return jsonMetadata;
}

function getJSONMetadata(user) {
  return new Promise((resolve, reject) => {
    steem.api.getAccounts([user], (err, result) => {
      if (err) {
        return reject(err);
      } else if (!result || result.length === 0) {
        return reject(new Error('User not found'));
      }

      let jsonMetadata = result[0].json_metadata;
      try {
        jsonMetadata = JSON.parse(jsonMetadata);
      } catch (e) {
        jsonMetadata = {};
      }
      return resolve(jsonMetadata);
    });
  });
}

function encryptMessage(message, secret) {
  return crypto.AES.encrypt(crypto.enc.Utf8.parse(message), secret).toString();
}

function decryptMessage(message, secret) {
  return crypto.AES.decrypt(message, secret).toString(crypto.enc.Utf8);
}

module.exports = {
  getJSONMetadata,
  parseJSONMetadata,
  encryptMessage,
  decryptMessage,
};
