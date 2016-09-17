const crypto = require('crypto-js');
const createECDH = require('create-ecdh');

function getSecretKeyForClientId(clientId) {
  const serverCrypto = createECDH(process.env.CRYPTO_MOD);
  serverCrypto.setPublicKey(process.env.PUBLIC_KEY, 'hex');
  serverCrypto.setPrivateKey(process.env.PRIVATE_KEY, 'hex');
  return serverCrypto.computeSecret(clientId, 'hex', 'hex');
}

function getJSONMetadata(user) {
  let jsonMetadata = user.json_metadata;
  try {
    jsonMetadata = JSON.parse(jsonMetadata);
  } catch (e) {
    jsonMetadata = {};
  }
  return jsonMetadata;
}

function encryptMessage(message, secret) {
  return crypto.AES.encrypt(crypto.enc.Utf8.parse(message), secret).toString();
}

function decryptMessage(message, secret) {
  return crypto.AES.decrypt(message, secret).toString(crypto.enc.Utf8);
}

module.exports = {
  getSecretKeyForClientId,
  getJSONMetadata,
  encryptMessage,
  decryptMessage,
};
