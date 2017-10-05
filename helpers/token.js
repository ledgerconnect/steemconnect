const jwt = require('jsonwebtoken');
const debug = require('debug')('sc2:server');
const { tokens } = require('../db/models');
const config = require('../config.json');

/** Create a new access token for user */
const issueUserToken = user => (
  jwt.sign(
    { role: 'user', user },
    process.env.JWT_SECRET
  )
);

/** Create a new access token for application and store it on the database */
const issueAppToken = (proxy, user, scope = []) => {
  const token = jwt.sign(
    { role: 'app', proxy, user, scope },
    process.env.JWT_SECRET,
    { expiresIn: config.token_expiration }
  );

  try {
    tokens.create({ client_id: proxy, user, token }).then(() => {
      debug(`A token for user @${user} with ${proxy} as proxy has been saved on database.`);
    });
  } catch (error) {
    throw new Error(error);
  }

  return token;
};

/** Create a new code for application */
const issueAppCode = (proxy, user, scope = []) =>
  jwt.sign(
    { role: 'code', proxy, user, scope },
    process.env.JWT_SECRET
  );

module.exports = {
  issueUserToken,
  issueAppToken,
  issueAppCode,
};
