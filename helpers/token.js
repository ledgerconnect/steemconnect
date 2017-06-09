const jwt = require('jsonwebtoken');
const config = require('../config.json');
const { tokens } = require('../db/models');
const debug = require('debug')('sc2:server');

/** Create a new access token for user */
const issueUserToken = (user) =>
  jwt.sign({
    role: 'user',
    user
  }, process.env.JWT_SECRET);

/** Create a new access token for application and store it on the database */
const issueAppToken = (proxy, user, scope = []) => {
  const token = jwt.sign({
    role: 'app',
    proxy,
    user,
    scope
  }, process.env.JWT_SECRET);

  try {
    tokens.create({ client_id: proxy, user, token }).then(() => {
      debug(`A token for user @${user} with ${proxy} as proxy has been saved on database.`);
    });
  } catch (error) {
    console.log(error);
  }

  return token;
};

module.exports = {
  issueUserToken,
  issueAppToken,
};
