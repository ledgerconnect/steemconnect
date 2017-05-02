const jwt = require('jsonwebtoken');
const config = require('../config.json');

const issueUserToken = (user) =>
  jwt.sign({ role: 'user', user }, process.env.JWT_SECRET);

const issueAppToken = (proxy, user) =>
  jwt.sign(
    { role: 'app', proxy, user },
    process.env.JWT_SECRET,
    { expiresIn: config.token_expiration }
  );

module.exports = {
  issueUserToken,
  issueAppToken,
};
