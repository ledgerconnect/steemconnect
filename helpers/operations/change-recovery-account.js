const cloneDeep = require('lodash/cloneDeep');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');
const { jsonParse } = require('../utils');

const parse = (query) => {
  const cQuery = cloneDeep(query);
  cQuery.account_to_recover = normalizeUsername(cQuery.account_to_recover);
  cQuery.new_recovery_account = normalizeUsername(cQuery.new_recovery_account);
  cQuery.extensions = query.extensions ? jsonParse(query.extensions) : [];

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.account_to_recover) && !await userExists(query.account_to_recover)) {
    errors.push({ field: 'account_to_recover', error: 'error_user_exist', values: { user: query.account_to_recover } });
  }

  if (!isEmpty(query.new_recovery_account) && !await userExists(query.new_recovery_account)) {
    errors.push({ field: 'new_recovery_account', error: 'error_user_exist', values: { user: query.new_recovery_account } });
  }
};

module.exports = {
  parse,
  validate,
};
