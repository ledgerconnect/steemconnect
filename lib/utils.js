const crypto = require('crypto'),
    createECDH = require('create-ecdh');

function getSecretKeyForClientId(clientId) {
    var serverCrypto = createECDH(process.env.CRYPTO_MOD);
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
    const cipher = crypto.createCipher('aes192', secret);
    let data = cipher.update(message, 'utf8', 'hex');
    data += cipher.final('hex');
    return data;
}

function decrypMessage(message, secret) {
    const cipher = crypto.createDecipher('aes192', secret);
    let data = cipher.update(message, 'hex', 'utf8');
    data += cipher.final('utf8');
    return data;
}

module.exports = {
	getSecretKeyForClientId,
	getJSONMetadata,
	encryptMessage,
	decrypMessage
}