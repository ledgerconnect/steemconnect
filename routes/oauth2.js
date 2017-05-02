const express = require('express');
const debug = require('debug')('sc2:server');
const { issueAppToken } = require('../helpers/token');
const { authenticate } = require('../helpers/middleware');
const config = require('../config.json');
const router = express.Router();

router.get('/oauth2/authorize', async (req, res, next) => {
  const redirectUri = req.query.redirect_uri;
  const clientId = req.query.client_id;
  const query = 'SELECT * FROM apps WHERE client_id = ${clientId} AND ${redirectUri} = ANY(redirect_uris) LIMIT 1';
  const apps = await req.db.query(query, { clientId, redirectUri });
  if (!apps[0]) {
    debug(`The app @${clientId} has not been setup.`);
    return res.redirect('/404');
  } else {
    res.render('index', { title: 'SteemConnect' });
  }
});

router.all('/api/oauth2/authorize', authenticate('user'), async (req, res, next) => {
  const clientId = req.query.client_id;
  debug(`Issue app token for user @${req.user} using @${clientId} proxy.`);
  const accessToken = issueAppToken(clientId, req.user);
  res.json({
    access_token: accessToken,
    expires_in: config.token_expiration,
  });
});

module.exports = router;
