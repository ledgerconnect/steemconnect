const express = require('express');
const _ = require('lodash');
const steem = require('steem');
const steemAuth = require('steemauth');
const jwt = require('jsonwebtoken');
const { verifyAuth } = require('./middleware');
const { parseJSONMetadata, getJSONMetadata, decryptMessage, encryptMessage } = require('../lib/utils');

const router = new express.Router();

router.post('/auth/login', (req, res) => {
  const { encryptedData } = req.body;
  const data = decryptMessage(encryptedData, req.cookies._csrf); // eslint-disable-line
  const { username, wif } = JSON.parse(data);
  steem.api.getAccounts([username], (err, result) => {
    if (err) {
      res.status(500).send({ error: JSON.stringify(err) });
    } else if (result.length === 0) {
      res.status(401).send({ error: 'Incorrect Username' });
    } else if (result[0] && steemAuth.wifIsValid(wif, result[0].posting.key_auths[0][0])) {
      const secret = encryptMessage(JSON.stringify({ username, wif }), process.env.JWT_SECRET);
      const auth = jwt.sign({ username, secret }, process.env.JWT_SECRET, { expiresIn: '36h' });
      res.send({ userAccount: result[0], auth });
    } else {
      res.status(401).send({ error: 'Incorrect Password' });
    }
  });
});

router.post('/auth/create', verifyAuth, (req, res) => {
  const { name, ownerWif, author, tagline,
    description, origins, redirect_urls, permissions } = req.body;
  const appUserName = req.username;
  const isWif = steemAuth.isWif(ownerWif);
  const ownerKey = (isWif) ? ownerWif : steemAuth.toWif(appUserName, ownerWif, 'owner');
  steem.api.getAccounts([appUserName], (err, result) => {
    try {
      if (err) {
        throw err;
      }
      const user = result[0];
      const jsonMetadata = parseJSONMetadata(user);
      jsonMetadata.app = {
        name,
        author,
        tagline,
        description,
        origins,
        redirect_urls,
        permissions,
      };
      steem.broadcast.accountUpdate(ownerKey, appUserName, undefined, undefined, undefined,
        user.memo_key, jsonMetadata, (accountUpdateErr) => {
          if (accountUpdateErr) {
            throw accountUpdateErr;
          }
          user.json_metadata = JSON.stringify(jsonMetadata);
          res.status(201).send(user);
        });
    } catch (e) {
      res.status(500).send({ error: JSON.stringify(e) });
    }
  });
});

router.get('/auth/authorize', verifyAuth, (req, res) => {
  const { appUserName, redirect_url } = req.query;
  getJSONMetadata(appUserName)
    .then(({ app }) => {
      if (typeof app !== 'object' || !app) { throw new Error('Invalid appName. App not found'); }
      if (_.indexOf(app.redirect_urls, redirect_url) === -1) { throw new Error('Redirect uri mismatch'); }

      const token = jwt.sign({ username: req.username, appUserName },
        process.env.JWT_SECRET, { expiresIn: '30d' });

      res.redirect(`${redirect_url}?token=${token}`);
    }).catch((err) => {
      if (typeof err === 'string') {
        res.status(500).send({ error: err });
      } else {
        let message = err.message;
        if (err.message.search('json_metadata') >= 0) {
          message = 'Invalid appName';
        }
        res.status(500).send({ error: message });
      }
    });
});

module.exports = router;
