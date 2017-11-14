const cloneDeep = require('lodash/cloneDeep');
const join = require('lodash/join');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['delegator', 'vesting_shares'];

const parse = async (query) => {
  const cQuery = cloneDeep(query);

  cQuery.delegatee = normalizeUsername(cQuery.delegatee);
  cQuery.delegator = normalizeUsername(cQuery.delegator);
  cQuery.vesting_shares = join([parseFloat(0).toFixed(6), 'VESTS'], ' ');

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.delegatee) && !await userExists(query.delegatee)) {
    errors.push({ field: 'delegatee', error: 'error_user_exist', values: { user: query.delegatee } });
  }
  if (!isEmpty(query.delegator) && !await userExists(query.delegator)) {
    errors.push({ field: 'delegator', error: 'error_user_exist', values: { user: query.delegator } });
  }
};

module.exports = {
  optionalFields,
  parse,
  validate,
};
