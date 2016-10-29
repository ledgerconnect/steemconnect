const express = require('express');
const _ = require('lodash');
const steem = require('steem');
const steemAuth = require('steemauth');
const jwt = require('jsonwebtoken');
const { verifyAuth } = require('./middleware');
const { decryptMessage, encryptMessage } = require('../lib/utils');
const { addPermissionToDB, upsertApp, getApp, deleteApp } = require('../db/utils');
const debug = require('debug')('steemconnect:route:auth');

const router = new express.Router();

router.get('/logout', (req, res) => {
  res.clearCookie('auth');
  res.redirect('back');
});

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
      const expiresIn = 60 * 60 * 24 * 30;
      const auth = jwt.sign({ username, secret }, process.env.JWT_SECRET, { expiresIn });
      res.cookie('auth', auth, { path: '/', secure: req.hostname !== 'localhost', maxAge: expiresIn * 1000 });
      res.send({ userAccount: result[0] });
    } else {
      res.status(401).send({ error: 'Incorrect Password' });
    }
  });
});

router.post('/auth/signup', (req, res) => {
  const { encryptedData } = req.body;
  const data = decryptMessage(encryptedData, req.cookies._csrf); // eslint-disable-line
  const { username, password } = JSON.parse(data);
  const publicKeys = steemAuth.generateKeys(username, password, ['owner', 'active', 'posting', 'memo']);
  const owner = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.owner, 1]] };
  const active = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.active, 1]] };
  const posting = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.posting, 1]] };
  steem.broadcast.accountCreate(process.env.SIGNUP_OWNER_WIF, process.env.SIGNUP_FEES,
      process.env.SIGNUP_CREATOR, username, owner, active, posting, publicKeys.memo, '',
      (err, result) => {
        if (result === null) {
          res.send({ success: true });
        } else {
          debug('Error while creating account', err, result);
          res.status(500).send({ error: 'Could not signup. Please try later' });
        }
      });
});

router.get('/auth/authorize', verifyAuth, (req, res) => {
  const { appUserName, redirect_url, permissions } = req.query;
  getApp(appUserName)
    .then((app) => {
      if (typeof app !== 'object' || !app) { throw new Error('App not found'); }
      if (_.indexOf(app.redirect_urls, redirect_url) === -1) { throw new Error('Redirect URL mismatch'); }
      if (!permissions) { throw new Error('No permissions specified'); }

      return addPermissionToDB(req.username, appUserName, permissions).then(() => res.redirect(`${redirect_url}`));
    }).catch((err) => {
      if (typeof err === 'string') {
        res.status(500).send({ error: err });
      } else {
        let message = err.message;
        if (err.message.search('json_metadata') >= 0 || err.message === 'User not found') {
          message = 'App not found';
        }
        res.status(500).send({ error: message });
      }
    });
});

router.get('/auth/app/@:appUserName', verifyAuth, (req, res) => {
  const { appUserName } = req.params;
  debug('getting app ', appUserName);
  return getApp(appUserName)
    .then(result => res.send(result))
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

router.post('/auth/app', verifyAuth, (req, res) => {
  const appData = req.body;
  appData.app = req.username;

  upsertApp(appData).then(() => res.send(appData))
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

router.delete('/auth/app', verifyAuth, (req, res) => {
  const username = req.username;
  debug('delete app ', username);
  deleteApp(username).then(() => res.send({ deleted: true }))
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});


module.exports = router;
