const _ = require('lodash');
const { getSecretKeyForClientId, decrypMessage } = require('../lib/utils');
const jwt = require('jsonwebtoken');

function verifyAuth(req, res, next) {
  if (req.cookies.auth && typeof req.headers.authorization === 'undefined') {
    req.headers.authorization = `Bearer ${req.cookies.auth}`; // eslint-disable-line no-param-reassign
  }
  if (typeof req.headers.authorization !== 'undefined' && (req.headers.authorization.search('Bearer ') === 0)) {
    const auth = req.headers.authorization.substring('Bearer '.length);
    jwt.verify(auth, process.env.JWT_SECRET, (err, jwtData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        const computeSecret = getSecretKeyForClientId(process.env.PUBLIC_KEY);
        let message = decrypMessage(jwtData.secret, computeSecret);
        message = JSON.parse(message);
        if (message.username === jwtData.username && (typeof req.token === 'undefined' || req.token.username === jwtData.username)) {
          _.each(jwtData, (value, key) => {
            req[key] = value; // eslint-disable-line no-param-reassign
          });
          _.each(message, (value, key) => {
            req[key] = value; // eslint-disable-line no-param-reassign
          });
          next();
        } else {
          res.sendStatus(401);
        }
      }
    });
  } else {
    res.sendStatus(401);
  }
}

function verifyToken(req, res, next) {
  const origin = req.get('origin');
  const token = req.get('x-steemconnect-token') || req.query.token;

  if (origin) {
    if (!token) {
      res.sendStatus(401);
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, jwtData) => {
        if (err) {
          res.sendStatus(401);
        } else {
          const isAuthorizedOrigin = _.indexOf(jwtData.allowedOrigin, origin) !== -1;
          if (isAuthorizedOrigin) {
            req.token = jwtData; // eslint-disable-line no-param-reassign
            next();
          } else {
            res.sendStatus(401);
          }
        }
      });
    }
  } else {
    /* For request made from steemconnect website */
    next();
  }
}

module.exports = {
  verifyAuth,
  verifyToken,
};
