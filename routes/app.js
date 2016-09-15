const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    steem = require('steem'),
    steemAuth = require('steemauth'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    cookie = require('./../lib/cookie');

//TODO regenerate move to env. Now here for the purpose of debugging;
let prime = 'eca59a04b80707d8bf72739b9e97f0692ef5614c83128e520348aa3cd81c1e3b';
let serverPublicKey = "8658dddffbb10bf4ad762957205573d2335f18a9eea4f11a39cd7e5d5b971a56";
let serverPrivateKey = "7cc13f49ad8737a8899b2eabbdb45f305169c984c0925c57f13410f04c4b97be";
let jwtSecret = 'a2a30bd6fc5f44c1b30439db8b7ef0833effda2e505fbed65e96e889919f1813';
router.post('/app/create', function (req, res, next) {
    var auth = (req.cookies['_sc_a']) ? JSON.parse(req.cookies['_sc_a']) : cookie.get();
    if (_.has(auth, 'username')) {
        let {username, passwordOrWif, publicMemo, appName, description, appManifest} = req.body;
        const newApp = crypto.createDiffieHellman(prime, 'hex');
        newApp.generateKeys();
        let publicKey = newApp.getPublicKey().toString('hex');
        let computeSecret = newApp.computeSecret(serverPublicKey, 'hex', 'hex');
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
    const serverCrypto = crypto.createDiffieHellman(prime, 'hex');
    serverCrypto.setPublicKey(serverPublicKey, 'hex');
    serverCrypto.setPrivateKey(serverPrivateKey, 'hex');
    let computeSecret = serverCrypto.computeSecret(clientId, 'hex', 'hex');
    console.log('computed secret', computeSecret);
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
                        let token = jwt.sign({ sessionId: req.session.id, username, scope, clientId, appName, appAuthor }, jwtSecret, { expiresIn: '36h' });
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
