const _ = require('lodash');
const { getSecretKeyForClientId, decrypMessage } = require('../lib/utils');
const jwt = require('jsonwebtoken');

function verifyAuth(req, res, next) {
  /* TODO Add Origin Check */
  if (req.cookies.token && typeof req.headers.authorization === 'undefined') {
    req.headers.authorization = `Bearer ${req.cookies.token}`; // eslint-disable-line no-param-reassign
  }
  if (typeof req.headers.authorization !== 'undefined' && (req.headers.authorization.search('Bearer ') === 0)) {
    const token = req.headers.authorization.substring('Bearer '.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, jwtData) => {
      if (err) {
        // console.log('err', err);
        res.sendStatus(401);
      } else {
        const computeSecret = getSecretKeyForClientId(process.env.PUBLIC_KEY);
        let message = decrypMessage(jwtData.secret, computeSecret);
        message = JSON.parse(message);
        if (message.username === jwtData.username) {
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

module.exports = {
  verifyAuth,
};
