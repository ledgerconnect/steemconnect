const _ = require('lodash');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['delegator', 'vesting_shares'];

const parse = async (query) => {
  const _query = _.cloneDeep(query);

  _query.delegatee = normalizeUsername(_query.delegatee);
  _query.delegator = normalizeUsername(_query.delegator);
  _query.vesting_shares = _.join([parseFloat(0).toFixed(6), 'VESTS'], ' ');

  return _query;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.delegatee) && !await userExists(query.delegatee)) {
    errors.push(`the user ${query.delegatee} doesn't exist`);
  }
  if (!isEmpty(query.delegator) && !await userExists(query.delegator)) {
    errors.push(`the user ${query.delegator} doesn't exist`);
  }
};

module.exports = {
  optionalFields,
  parse,
  validate
};
