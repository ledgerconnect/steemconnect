const express = require('express');
const qs = require('query-string');
const config = require('../config.json');
const { verifyOrigin, authenticateUser, verifyPermissions } = require('../helpers/middleware');
const { issueUserToken, issueAppToken } = require('../helpers/token');
const { decryptMessage } = require('../helpers/hash');
const router = express.Router();

router.get('/authorize', verifyOrigin, authenticateUser, verifyPermissions, async (req, res, next) => {
  const redirectUri = req.query.redirect_uri;
  const accessToken = issueAppToken(req.app, req.user);
  const tokenStr = qs.stringify({
    access_token: accessToken,
    expires_in: config.token_expiration,
  });
  res.redirect(`${redirectUri}?${tokenStr}`);
});

router.post('/login', async (req, res, next) => {
  const privateWif = decryptMessage(req.body.message, req.cookies._secret);
  const publicWif = res.steem.auth.isWif(privateWif) ? res.steem.auth.wifToPublic(privateWif) : '';
  const keyReferences = await res.steem.api.getKeyReferencesAsync([publicWif]);
  const user = keyReferences[0][0];
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const token = issueUserToken(user);
  res.cookie('_token', token, { httpOnly: true });
  res.json({
    success: true,
    username: user,
  });
});

module.exports = router;
