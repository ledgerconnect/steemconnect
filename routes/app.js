const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    steem = require('steem'),
    steemAuth = require('steemauth'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    cookie = require('./../lib/cookie');

router.post('/app/create', function (req, res, next) {
    var auth = (req.cookies['_sc_a']) ? JSON.parse(req.cookies['_sc_a']) : cookie.get();
    if (_.has(auth, 'username')) {
        let {username, passwordOrWif, publicMemo, appName, description, appManifest} = req.body;
        const newApp = crypto.createDiffieHellman(process.env.PRIME, 'hex');
        newApp.generateKeys();
        let publicKey = newApp.getPublicKey().toString('hex');
        let computeSecret = newApp.computeSecret(process.env.PUBLIC_KEY, 'hex', 'hex');
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
    let {appAuthor, appName, clientId, redirect_uri, scope, username, password } = req.query;
    const serverCrypto = crypto.createDiffieHellman(process.env.PRIME, 'hex');
    serverCrypto.setPublicKey(process.env.PUBLIC_KEY, 'hex');
    serverCrypto.setPrivateKey(process.env.PRIVATE_KEY, 'hex');
    let computeSecret = serverCrypto.computeSecret(clientId, 'hex', 'hex');
    // console.log('computed secret', computeSecret);
    steem.api.getAccounts([appAuthor], (err, result) => {
        if (err) {
            res.json({
                error: JSON.stringify(err)
            })
        } else {
            try {
                let jsonMetadata = getJSONMetadata(result[0]);
                if (typeof jsonMetadata.appCreated === 'object' && jsonMetadata.appCreated[appName]) {
                    let appDetails = jsonMetadata.appCreated[appName];
                    var appManifest = decrypMessage(appDetails.appManifest, computeSecret)
                    appManifest = JSON.parse(appManifest);
                    let appOrigin = _.find(appManifest.origins, ['from', req.get('origin')]);
                    if (!appOrigin)
                        throw new Error('Invalid Origin');
                    else if (appOrigin.to !== redirect_uri)
                        throw new Error('Redirect uri mismatch');
                    // console.log('appManifest', appManifest);
                    if (!(username || password)) {
                        console.log('Perform login')
                        res.render('auth/login', { layout: 'user', title: 'Steem Connect' });
                    } else {
                        //Todo verify username and password
                        //Create token
                        req.session.auth = req.session.auth || {};
                        req.session.auth[appName] = { username, password, scope, clientId, appName, appAuthor };
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
});

router.get('/app/test', function (req, res, next) {
    console.log(req.session);
    res.json({
        test: 'true'
    })
});
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
