const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    steem = require('steem'),
    steemAuth = require('steemauth'),
    createECDH = require('create-ecdh'),
    jwt = require('jsonwebtoken'),
    {verifyAuth} = require('./middleware'),
    cookie = require('./../lib/cookie');

const {getSecretKeyForClientId, getJSONMetadata, decrypMessage, encryptMessage} = require('../lib/utils');

router.post('/app/create', verifyAuth, function (req, res, next) {
    let {username, ownerWif, appName, description, appManifest} = req.body;
    var newApp = createECDH(process.env.CRYPTO_MOD);
    newApp.generateKeys();
    var publicKey = newApp.getPublicKey('hex');
    let computeSecret = newApp.computeSecret(process.env.PUBLIC_KEY, 'hex', 'hex');
    appManifest.author = username; //For security purpose
    appManifest = JSON.stringify(appManifest);
    let encryptedAppManifest = encryptMessage(appManifest, computeSecret);

    steem.api.getAccounts([username], (err, result) => {
        var isWif = steemAuth.isWif(ownerWif);
        var ownerKey = (isWif) ? ownerWif : steemAuth.toWif(username, ownerWif, 'owner');
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
});

router.get('/app/login', function (req, res, next) {
    let { username, wif } = req.query;
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
});

router.get('/app/authorize', verifyAuth, function (req, res, next) {
    let {appAuthor, appName, clientId, redirect_uri, scope } = req.query;
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
                    if (!_.find(appManifest.origins, ['to', redirect_uri]))
                        throw new Error('Redirect uri mismatch');
                    let token = jwt.sign({ username: req.username, scope, clientId, appName, appAuthor }, process.env.JWT_SECRET, { expiresIn: '36h' });
                    res.redirect(`${redirect_uri}?token=${token}`);
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
});

router.get('/app/test', verifyAuth, function (req, res, next) {
    res.json({
        test: 'true'
    })
});

module.exports = router;
