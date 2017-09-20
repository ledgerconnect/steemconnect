const express = require('express');
const debug = require('debug')('sc2:server');
const { issueAppToken, issueAppCode } = require('../helpers/token');
const { authenticate } = require('../helpers/middleware');
const config = require('../config.json');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/oauth2/authorize', async (req, res) => {
  const redirectUri = req.query.redirect_uri;
  const clientId = req.query.client_id;
  const app = await req.db.apps.findOne({
    where: {
      client_id: clientId,
      redirect_uris: { $contains: [redirectUri] },
    },
  });
  if (!app) {
    debug(`The app @${clientId} has not been setup.`);
    res.redirect('/404');
  } else {
    res.render('index', { title: 'SteemConnect' });
  }
});

router.all('/api/oauth2/authorize', authenticate('user'), async (req, res) => {
  const clientId = req.query.client_id;
  const responseType = req.query.response_type;
  const scope = req.query.scope ? req.query.scope.split(',') : [];

  if (responseType === 'code') {
    debug(`Issue app code for user @${req.user} using @${clientId} proxy.`);
    const code = issueAppCode(clientId, req.user, scope);
    res.json({ code });
  } else {
    debug(`Issue app token for user @${req.user} using @${clientId} proxy.`);
    const accessToken = issueAppToken(clientId, req.user, scope);
    res.json({
      access_token: accessToken,
      expires_in: config.token_expiration,
      username: req.user,
    });
  }
});

/** Request app access token */
router.post('/api/oauth2/token', authenticate('code'), (req, res) => {
  debug(`Issue app token for user @${req.user} using @${req.proxy} proxy.`);
  const accessToken = issueAppToken(req.proxy, req.user, req.scope);
  res.json({
    access_token: accessToken,
    expires_in: config.token_expiration,
    username: req.user,
  });
});

/** Revoke app access token */
router.all('/api/oauth2/token/revoke', authenticate('app'), async (req, res) => {
  await req.db.tokens.destroy({ where: { token: req.token } });
  res.json({ success: true });
});

module.exports = router;
