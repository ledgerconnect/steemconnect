const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    steem = require('steem'),
    steemAuth = require('steemauth'),
    crypto = require('crypto'),
    cookie = require('./../lib/cookie');

//TODO regenerate move to env. Now here for the purpose of debugging;
let prime = 'eca59a04b80707d8bf72739b9e97f0692ef5614c83128e520348aa3cd81c1e3b';
let serverPublicKey = "8658dddffbb10bf4ad762957205573d2335f18a9eea4f11a39cd7e5d5b971a56";
let serverPrivateKey = "7cc13f49ad8737a8899b2eabbdb45f305169c984c0925c57f13410f04c4b97be";

router.post('/app/create', function (req, res, next) {
    var auth = (req.cookies['_sc_a']) ? JSON.parse(req.cookies['_sc_a']) : cookie.get();
    if (_.has(auth, 'username')) {
        let {username, passwordOrWif, publicMemo, appName, description, appManifest} = req.body;
        const newApp = crypto.createDiffieHellman(prime, 'hex');
        newApp.generateKeys();
        let publicKey = newApp.getPublicKey().toString('hex');
        let computeSecret = newApp.computeSecret(serverPublicKey, 'hex', 'hex');
        appManifest = JSON.stringify(appManifest);
        const cipher = crypto.createCipher('aes192', computeSecret);
        var encryptedAppManifest = cipher.update(appManifest, 'utf8', 'hex');
        encryptedAppManifest += cipher.final('hex');

        steem.api.getAccounts([username], (err, result) => {
            var isWif = steemAuth.isWif(passwordOrWif);
            var ownerKey = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'owner');
            if (err) {
                res.json({
                    error: JSON.stringify(err)
                })
            } else {
                let user = result[0];
                let jsonMetadata = user.json_metadata;
                try {
                    jsonMetadata = JSON.parse(jsonMetadata);
                } catch (e) {
                    jsonMetadata = {};
                }
                jsonMetadata.appCreated = jsonMetadata.appCreated || [];
                jsonMetadata.appCreated.push({ appName, description, appManifest: encryptedAppManifest })
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

module.exports = router;
