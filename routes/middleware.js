/* eslint-disable no-param-reassign,consistent-return */
const _ = require('lodash');
const url = require('url');
const { decryptMessage } = require('../lib/utils');
const jwt = require('jsonwebtoken');
const apiList = require('../lib/apiList');

function verifyAuth(req, res, next) {
  if (req.cookies.auth && typeof req.headers.authorization === 'undefined') {
    req.headers.authorization = `Bearer ${req.cookies.auth}`;
  }
  if (typeof req.headers.authorization !== 'undefined' && (req.headers.authorization.search('Bearer ') === 0)) {
    const auth = req.headers.authorization.substring('Bearer '.length);
    jwt.verify(auth, process.env.JWT_SECRET, (err, jwtData) => {
      if (err) {
        return res.sendStatus(401);
      }
      let message = decryptMessage(jwtData.secret, process.env.JWT_SECRET);
      message = JSON.parse(message);
      if (message.username === jwtData.username && (typeof req.token === 'undefined' || req.token.username === jwtData.username)) {
        _.each(jwtData, (value, key) => {
          req[key] = value;
        });
        _.each(message, (value, key) => {
          req[key] = value;
        });
        return next();
      }
    });
  } else {
    return res.sendStatus(401);
  }
}

function verifyToken(req, res, next) {
  const origin = req.get('origin');
  const token = req.get('x-steemconnect-token') || req.query.token;
  let hostname = 'localhost';
  if (origin) {
    hostname = url.parse(origin).hostname;
  }

  const isDifferentHost = (hostname !== 'localhost' && hostname !== 'steemconnect.com' && hostname !== 'dev.steemconnect.com');
  if (isDifferentHost) {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, jwtData) => {
        if (err) {
          return res.sendStatus(401);
        }
        const isAuthorizedOrigin = _.indexOf(jwtData.allowedOrigin, origin) !== -1;
        if (isAuthorizedOrigin) {
          req.token = jwtData;
          return next();
        }
      });
    } else {
      return res.sendStatus(401);
    }
  }
    /* For request made from steemconnect website */
  return next();
}

function checkPermission(req, res, next) {
  const token = req.token || {};
  const permissions = _.map(token.permission, v => apiList[v]);
  const requestUrl = url.parse(req.originalUrl);
  const requestPath = requestUrl.pathname.replace(/\/$/, '');
  const selectedQuery = _.find(permissions, p => (p.path === requestPath));
  if (selectedQuery || requestPath === '/api/getAccount') {
    return next();
  }

  return res.status(401).json({ error: 'Not permitted', acceptedPermissions: token.permission || [] });
}

module.exports = {
  verifyAuth,
  verifyToken,
  checkPermission,
};
