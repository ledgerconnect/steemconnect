const jwt = require('jsonwebtoken');
const config = require('../config.json');

const issueUserToken = (user) =>
  jwt.sign({
    role: 'user',
    user
  }, process.env.JWT_SECRET);

const issueAppToken = (proxy, user, scope = []) =>
  jwt.sign({
    role: 'app',
    proxy,
    user,
    scope
  }, process.env.JWT_SECRET);

module.exports = {
  issueUserToken,
  issueAppToken,
};
