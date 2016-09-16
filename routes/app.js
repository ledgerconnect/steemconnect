const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    steem = require('steem'),
    steemAuth = require('steemauth'),
    crypto = require('crypto'),
    createECDH = require('create-ecdh'),
    jwt = require('jsonwebtoken'),
    cookie = require('./../lib/cookie');

var mod = 'secp256k1';

router.post('/app/create', function (req, res, next) {
    var auth = (req.cookies['_sc_a']) ? JSON.parse(req.cookies['_sc_a']) : cookie.get();
    if (_.has(auth, 'username')) {
        let {username, passwordOrWif, publicMemo, appName, description, appManifest} = req.body;
        var newApp = createECDH(mod);
        newApp.generateKeys();
        var publicKey = newApp.getPublicKey('hex');
        let computeSecret = newApp.computeSecret(process.env.PUBLIC_KEY, 'hex', 'hex');
        appManifest.author = username; //For security purpose
        appManifest = JSON.stringify(appManifest);
        let encryptedAppManifest = encryptMessage(appManifest, computeSecret);

        steem.api.getAccounts([username], (err, result) => {
            var isWif = steemAuth.isWif(passwordOrWif);
            var ownerKey = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'owner');
            if (err) {
                res.json({
                    error: JSON.stringify(err)
                })
            } else {
                let user = result[0];
                let jsonMetadata = getJSONMetadata(user);
                jsonMetadata.appCreated = jsonMetadata.appCreated || {};
                jsonMetadata.appCreated[appName] = { appName, description, appManifest: encryptedAppManifest };
                steem.broadcast.accountUpdate(ownerKey, username, undefined, undefined, undefined, user.memo_key, jsonMetadata, function (err, result) {
                    res.json({
                        clientId: publicKey,
                        clientSecret: computeSecret
                    });
                });
            }
        });
    } else {
        res.json({
            isAuthenticated: false
        })
    }
});

router.get('/app/authorize', function (req, res, next) {
    let {appAuthor, appName, clientId, redirect_uri, scope, username, wif } = req.query;
    // console.log('computed secret', computeSecret);
    console.log('appAuthor, appName, clientId, redirect_uri, scope, username, wif', appAuthor, appName, clientId, redirect_uri, scope, username, wif);
    if (appAuthor) {
        //Perform App Login
        steem.api.getAccounts([appAuthor], (err, result) => {
            if (err) {
                res.json({
                    error: JSON.stringify(err)
                })
            } else {
                try {
                    let computeSecret = getSecretKeyForClientId(clientId);
                    let jsonMetadata = getJSONMetadata(result[0]);
                    if (typeof jsonMetadata.appCreated === 'object' && jsonMetadata.appCreated[appName]) {
                        let appDetails = jsonMetadata.appCreated[appName];
                        var appManifest = decrypMessage(appDetails.appManifest, computeSecret)
                        appManifest = JSON.parse(appManifest);
                        let appOrigin = _.find(appManifest.origins, ['from', req.get('origin')]);
                        console.log(req.headers);
                        if (!appOrigin)
                            throw new Error('Invalid Origin');
                        else if (appOrigin.to !== redirect_uri)
                            throw new Error('Redirect uri mismatch');
                        console.log('appManifest', appManifest);
                        if (!(username || wif)) {
                            console.log('Perform login')
                            res.render('auth/login', { layout: 'auth', title: 'Steem Connect', serverPublicKey: process.env.PUBLIC_KEY });
                        } else {
                            //Todo verify username and wif
                            // Create token
                            req.session.auth = req.session.auth || {};
                            req.session.auth[appName] = { username, wif, scope, clientId, appName, appAuthor };
                            let token = jwt.sign({ sessionId: req.session.id, username, scope, clientId, appName, appAuthor }, process.env.JWT_SECRET, { expiresIn: '36h' });
                            res.json({ token });
                        }
                    } else {
                        throw new Error('Invalid author or appName. App not found');
                    }
                } catch (e) {
                    let message = e.message;
                    if (e.message.search('decrypt') >= 0)
                        message = 'Invalid clientId';
                    res.json({
                        error: message
                    })
                }
            }
        });
    } else {
        //Perform Login for SteemConnect
        let computeSecret = getSecretKeyForClientId(process.env.PUBLIC_KEY);
        steem.api.getAccounts([username], (err, result) => {
            if (err) {
                err && console.error('Error while processing getAccounts', JSON.stringify(err));
                res.send({
                    error: JSON.stringify(err)
                })
            } else if (result.length === 0) {
                res.send({
                    error: 'Incorrect Username'
                })
            } else if (result[0] && steemAuth.wifIsValid(wif, result[0].posting.key_auths[0][0])) {
                let secret = encryptMessage(JSON.stringify({ username, wif }), computeSecret);
                let token = jwt.sign({ username, secret, for: 'SteemConnect' }, process.env.JWT_SECRET, { expiresIn: '36h' });
                res.send({
                    userAccount: result[0],
                    token: token
                })
            } else {
                res.send({
                    error: 'Incorrect Password'
                })
            }
        });
    }
});

router.get('/app/test', function (req, res, next) {
    console.log(req.session);
    res.json({
        test: 'true'
    })
});

function getSecretKeyForClientId(clientId) {
    var serverCrypto = createECDH(mod);
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

module.exports = router;
