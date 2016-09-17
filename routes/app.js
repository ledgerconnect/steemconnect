const express = require('express');
const _ = require('lodash');
const steem = require('steem');
const steemAuth = require('steemauth');
const createECDH = require('create-ecdh');
const jwt = require('jsonwebtoken');
const { verifyAuth } = require('./middleware');
const { getSecretKeyForClientId, getJSONMetadata, decrypMessage, encryptMessage } = require('../lib/utils');

const router = new express.Router();

router.post('/app/create', verifyAuth, (req, res) => {
  const { username, ownerWif, appName, description } = req.body;
  let { appManifest } = req.body;
  const newApp = createECDH(process.env.CRYPTO_MOD);
  newApp.generateKeys();
  const publicKey = newApp.getPublicKey('hex');
  const computeSecret = newApp.computeSecret(process.env.PUBLIC_KEY, 'hex', 'hex');
  appManifest.author = username; /* For security purpose */
  appManifest = JSON.stringify(appManifest);
  const encryptedAppManifest = encryptMessage(appManifest, computeSecret);

  steem.api.getAccounts([username], (err, result) => {
    const isWif = steemAuth.isWif(ownerWif);
    const ownerKey = (isWif) ? ownerWif : steemAuth.toWif(username, ownerWif, 'owner');
    if (err) {
      res.json({
        error: JSON.stringify(err),
      });
    } else {
      const user = result[0];
      const jsonMetadata = getJSONMetadata(user);
      jsonMetadata.appCreated = jsonMetadata.appCreated || {};
      jsonMetadata.appCreated[appName] = {
        appName, description, appManifest: encryptedAppManifest,
      };
      steem.broadcast.accountUpdate(ownerKey, username, undefined, undefined, undefined,
        user.memo_key, jsonMetadata, (accountUpdateErr) => {
          if (accountUpdateErr) {
            res.json({ error: JSON.stringify(accountUpdateErr) });
          } else {
            res.json({
              clientId: publicKey,
              clientSecret: computeSecret,
            });
          }
        });
    }
  });
});

router.get('/app/login', (req, res) => {
  const { username, wif } = req.query;
  const computeSecret = getSecretKeyForClientId(process.env.PUBLIC_KEY);
  steem.api.getAccounts([username], (err, result) => {
    if (err) {
      res.send({ error: JSON.stringify(err) });
    } else if (result.length === 0) {
      res.send({ error: 'Incorrect Username' });
    } else if (result[0] && steemAuth.wifIsValid(wif, result[0].posting.key_auths[0][0])) {
      const secret = encryptMessage(JSON.stringify({ username, wif }), computeSecret);
      const auth = jwt.sign({ username, secret }, process.env.JWT_SECRET, { expiresIn: '36h' });
      res.send({ userAccount: result[0], auth });
    } else {
      res.send({ error: 'Incorrect Password' });
    }
  });
});

router.get('/app/authorize', verifyAuth, (req, res) => {
  const { appAuthor, appName, clientId, redirect_uri, scope } = req.query;
  steem.api.getAccounts([appAuthor], (err, result) => {
    if (err) {
      res.json({ error: JSON.stringify(err) });
    } else {
      try {
        const computeSecret = getSecretKeyForClientId(clientId);
        const jsonMetadata = getJSONMetadata(result[0]);
        if (typeof jsonMetadata.appCreated === 'object' && jsonMetadata.appCreated[appName]) {
          const appDetails = jsonMetadata.appCreated[appName];
          let appManifest = decrypMessage(appDetails.appManifest, computeSecret);
          appManifest = JSON.parse(appManifest);
          if (!_.find(appManifest.origins, ['to', redirect_uri])) { // eslint-disable-line
            throw new Error('Redirect uri mismatch');
          }
          const token = jwt.sign({ username: req.username, scope, clientId, appName, appAuthor }, process.env.JWT_SECRET, { expiresIn: '36h' });
          res.redirect(`${redirect_uri}?token=${token}`); // eslint-disable-line
        } else {
          throw new Error('Invalid author or appName. App not found');
        }
      } catch (e) {
        let message = e.message;
        if (e.message.search('decrypt') >= 0) {
          message = 'Invalid clientId';
        }
        res.json({ error: message });
      }
    }
  });
});

module.exports = router;
