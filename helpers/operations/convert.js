const cloneDeep = require('lodash/cloneDeep');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const parse = (query) => {
  const cQuery = cloneDeep(query);
  cQuery.owner = normalizeUsername(cQuery.owner);
  cQuery.requestid = parseInt(cQuery.requestid, 10);

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.owner) && !await userExists(query.owner)) {
    errors.push({ field: 'owner', error: 'error_user_exist', values: { user: query.owner } });
  }
};

module.exports = {
  parse,
  validate,
};
