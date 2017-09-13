const _ = require('lodash');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['delegator', 'vesting_shares'];

const parse = async (query) => {
  const cQuery = _.cloneDeep(query);

  cQuery.delegatee = normalizeUsername(cQuery.delegatee);
  cQuery.delegator = normalizeUsername(cQuery.delegator);
  cQuery.vesting_shares = _.join([parseFloat(0).toFixed(6), 'VESTS'], ' ');

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.delegatee) && !await userExists(query.delegatee)) {
    errors.push({ field: 'delegatee', error: `the user ${query.delegatee} doesn't exist` });
  }
  if (!isEmpty(query.delegator) && !await userExists(query.delegator)) {
    errors.push({ field: 'delegator', error: `the user ${query.delegator} doesn't exist` });
  }
};

module.exports = {
  optionalFields,
  parse,
  validate,
};
