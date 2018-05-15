const jwt = require('jsonwebtoken');
const intersection = require('lodash/intersection');
const { tokens, apps } = require('../db/models');

/**
 * Check if user allow app proxy account to post on his behalf
 * And if app allow @steemconnect to post on his behalf
 */
const verifyPermissions = async (req, res, next) => {
  const accounts = await req.steem.api.getAccountsAsync([req.proxy, req.user]);

  const userAccountAuths = accounts[1].posting.account_auths.map(account => account[0]);
  if (userAccountAuths.indexOf(req.proxy) === -1) {
    res.status(401).json({
      error: 'unauthorized_client',
      error_description: `The app @${req.proxy} doesn't have permission to broadcast for @${req.user}`,
    });
  } else {
    const appAccountAuths = accounts[0].posting.account_auths.map(account => account[0]);
    if (appAccountAuths.indexOf(process.env.BROADCASTER_USERNAME) === -1) {
      res.status(401).json({
        error: 'unauthorized_client',
        error_description: `Broadcaster account doesn't have permission to broadcast for @${req.proxy}`,
      });
    } else {
      next();
    }
  }
};

const strategy = (req, res, next) => {
  let authorization = req.get('authorization');
  if (authorization) {
    authorization = authorization.replace(/^(Bearer|Basic)\s/, '').trim();
  }
  const token = authorization
    || req.query.access_token
    || req.body.access_token
    || req.query.code
    || req.body.code
    || req.query.refresh_token
    || req.body.refresh_token;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    /* eslint-disable no-param-reassign */
    req.token = token;
    req.role = decoded.role;
    req.user = decoded.user;
    req.proxy = decoded.proxy;
    req.scope = decoded.scope || [];
    /* eslint-enable no-param-reassign */
  } catch (err) {
    // console.log(err);
  }
  next();
};

const authenticate = roles => async (req, res, next) => {
  if (req.proxy) {
    const appStatus = await apps.findOne({
      where: { client_id: req.proxy },
    });
    if (!appStatus || (appStatus && appStatus.is_disabled)) {
      res.status(401).json({
        error: 'application_disabled',
        error_description: 'This application has been disabled by SteemConnect',
      });
      return;
    }
  }
  let role = roles;
  if (Array.isArray(roles)) {
    if (req.role && roles.includes(req.role)) {
      role = req.role;
    }
  }

  if (!req.role || (role && req.role !== role)) {
    res.status(401).json({
      error: 'invalid_grant',
      error_description: 'The token has invalid role',
    });
  } else if (req.role === 'app') {
    const token = await tokens.findOne({ where: { token: req.token } });
    if (!token) {
      res.status(401).json({
        error: 'invalid_grant',
        error_description: 'The access_token has been revoked',
      });
    } else {
      next();
    }
  } else if (req.role === 'code' || req.role === 'refresh') {
    const secret = req.query.client_secret || req.body.client_secret;
    const app = await apps.findOne({
      where: {
        client_id: req.proxy,
        secret,
      },
    });
    if (!app) {
      res.status(401).json({
        error: 'invalid_grant',
        error_description: 'The code or secret is not valid',
      });
    } else if (app.allowed_ips) {
      const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      if (intersection(app.allowed_ips, reqIp.replace(' ', '').split(',')).length > 0) {
        next();
      } else {
        res.status(401).json({
          error: 'unauthorized_access',
          error_description: `The IP ${reqIp} is not authorized`,
        });
      }
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = {
  verifyPermissions,
  strategy,
  authenticate,
};
