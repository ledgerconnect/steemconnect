const jwt = require('jsonwebtoken');
const { tokens } = require('../db/models');

/**
 * Check if user allow app proxy account to post on his behalf
 * And if app allow @steemconnect to post on his behalf
 */
const verifyPermissions = async (req, res, next) => {
  const accounts = await req.steem.api.getAccountsAsync([req.proxy, req.user]);

  const userAccountAuths = accounts[1].posting.account_auths.map((account) => account[0]);
  if (userAccountAuths.indexOf(req.proxy) === -1) {
    console.log(`The app @${req.proxy} don't have permission to broadcast for @${req.user}.`);
    return res.status(401).send('Unauthorized');
  }

  const appAccountAuths = accounts[0].posting.account_auths.map((account) => account[0]);
  if (appAccountAuths.indexOf(process.env.BROADCASTER_USERNAME) === -1) {
    console.log(`Broadcaster account don't have permission to broadcast for @${req.proxy}.`);
    return res.status(401).send('Unauthorized');
  }
  next();
};

const strategy = (req, res, next) => {
  const token = req.get('authorization') || req.query.access_token;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.token = token;
    req.role = decoded.role;
    req.user = decoded.user;
    req.proxy = decoded.proxy;
    req.scope = decoded.scope || [];
  } catch(err) {}
  next();
};

const authenticate = (role) => async (req, res, next) => {
  if (!req.role || (role && req.role !== role)) {
    return res.status(401).send('Unauthorized');
  }
  if (req.role === 'app') {
    const token = await tokens.findOne({ where: { token: req.token } });
    if (!token) {
      return res.status(401).send('Unauthorized');
    }
  }
  next();
};

module.exports = {
  verifyPermissions,
  strategy,
  authenticate,
};
