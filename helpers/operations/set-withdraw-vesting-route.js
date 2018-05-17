const cloneDeep = require('lodash/cloneDeep');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const parse = (query) => {
  const cQuery = cloneDeep(query);
  cQuery.from_account = normalizeUsername(cQuery.from_account);
  cQuery.to_account = normalizeUsername(cQuery.to_account);
  cQuery.percent = parseInt(cQuery.percent, 0);

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.from_account) && !await userExists(query.from_account)) {
    errors.push({ field: 'from_account', error: 'error_user_exist', values: { user: query.from_account } });
  }

  if (!isEmpty(query.to_account) && !await userExists(query.to_account)) {
    errors.push({ field: 'to_account', error: 'error_user_exist', values: { user: query.to_account } });
  }
};

module.exports = {
  parse,
  validate,
};
