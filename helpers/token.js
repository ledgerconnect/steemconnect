const jwt = require('jsonwebtoken');
const config = require('../config.json');

const issueUserToken = (user) =>
  jwt.sign({ type: 'user', user }, process.env.JWT_SECRET);

const issueAppToken = (app, user) =>
  jwt.sign(
    { type: 'app', app, user },
    process.env.JWT_SECRET,
    { expiresIn: config.token_expiration }
  );

module.exports = {
  issueUserToken,
  issueAppToken,
};
