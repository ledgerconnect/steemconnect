const jwt = require('jsonwebtoken');
const apps = require('../helpers/apps.json');

/**
 * Check if user has a valid token saved on localStorage.
 * If token is not valid, redirect user to login page.
 */
const authenticateUser = (req, res, next) => {
  const originalUrl = req.originalUrl;
  const redirectUri = `/login?next=${encodeURIComponent(originalUrl)}`;
  let decoded;
  try {
    const token = req.cookies._token;
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(err) {
    return res.redirect(redirectUri);
  }
  if (decoded.user && decoded.type === 'user') {
    req.user = decoded.user;
    next();
  } else {
    return res.redirect(redirectUri);
  }
};

/**
 * Check if app has a valid token on query string.
 * If token is not valid, send 401 error.
 */
const authenticateApp = (req, res, next) => {
  let decoded;
  try {
    const token = req.query.access_token;
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(err) {
    return res.status(401).send('Unauthorized');
  }
  if (decoded.user && decoded.app && decoded.type === 'app') {
    req.app = decoded.app;
    req.user = decoded.user;
    next();
  } else {
    return res.status(401).send('Unauthorized');
  }
};

/**
 * Check if clientId is a valid app username
 * and if redirectUri is setup by the app
 */
const verifyApp = (req, res, next) => {
  const redirectUri = req.query.redirect_uri;
  const clientId = req.query.client_id;

  const app = apps[clientId];
  if (!app) {
    console.log(`The app @${clientId} has not been setup.`);
    return res.redirect('/404');
  }

  if (!redirectUri || app.redirect_uris.indexOf(redirectUri) === -1)
   {
    console.log(`Redirect URI '${redirectUri}' is not authorized for app @${clientId}.`);
    return res.redirect('/404');
  }
  req.app = clientId;
  next();
};

/**
 * Check if user allow app proxy account to post on his behalf
 * And if app allow @steemconnect to post on his behalf
 */
const verifyPermissions = async (req, res, next) => {
  const originalUrl = req.originalUrl;
  const proxy = apps[req.app] ? apps[req.app].proxy || '' : '';
  const accounts = await res.steem.api.getAccountsAsync([proxy, req.user]);

  const userAccountAuths = accounts[1].posting.account_auths.map((account) => account[0]);
  if (userAccountAuths.indexOf(proxy) === -1) {
    console.log(`Proxy account @${proxy} don't have permission to broadcast for @${req.user}.`);
    return res.redirect(`/authorize/@${proxy}?redirect_uri=${encodeURIComponent(originalUrl)}`);
  }

  const appAccountAuths = accounts[0].posting.account_auths.map((account) => account[0]);
  if (appAccountAuths.indexOf(process.env.BROADCASTER_USERNAME) === -1) {
    console.log(`Broadcaster account don't have permission to broadcast for @${proxy}.`);
    return res.redirect('/404');
  }
  next();
};

/**
 * Add req.username if user is logged
 */
const init = (req, res, next) => {
  const token = req.cookies._token;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.username = (decoded.type === 'user')
      ? decoded.user
      : '';
  } catch(err) {}
  next();
};

module.exports = {
  authenticateUser,
  authenticateApp,
  verifyApp,
  verifyPermissions,
  init,
};
