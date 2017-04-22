const express = require('express');
const qs = require('query-string');
const debug = require('debug')('sc2:server');
const config = require('../config.json');
const { verifyApp, authenticateUser, verifyPermissions } = require('../helpers/middleware');
const { issueUserToken, issueAppToken } = require('../helpers/token');
const { decryptMessage } = require('../helpers/hash');
const router = express.Router();

router.get('/authorize', verifyApp, authenticateUser, verifyPermissions, async (req, res, next) => {
  const redirectUri = req.query.redirect_uri;

  debug(`Issue token for app @${req.app}`);
  const accessToken = issueAppToken(req.app, req.user);

  const tokenStr = qs.stringify({
    access_token: accessToken,
    expires_in: config.token_expiration,
  });
  res.redirect(`${redirectUri}?${tokenStr}`);
});

router.post('/login', async (req, res, next) => {
  const secret = req.cookies._secret;
  const message = req.body.message;
  if (!secret || !message) {
    return res.status(401).send('Unauthorized');
  }

  let privateWif = decryptMessage(message, secret);
  const publicWif = res.steem.auth.isWif(privateWif) ? res.steem.auth.wifToPublic(privateWif) : '';
  privateWif = null;
  const keyReferences = await res.steem.api.getKeyReferencesAsync([publicWif]);
  const user = keyReferences[0][0];
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  debug(`Issue token for user @${user}`);
  const token = issueUserToken(user);

  debug(`Save token on user cookies`);
  res.cookie('_token', token, {
    path: '/',
    secure: req.hostname !== 'localhost',
  });

  res.json({
    success: true,
    username: user,
  });
});

module.exports = router;
