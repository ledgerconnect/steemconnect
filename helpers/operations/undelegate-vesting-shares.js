const _ = require('lodash');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const normalize = async (query) => {
  const _query = _.cloneDeep(query);

  _query.delegatee = normalizeUsername(_query.delegatee);

  _query.vesting_shares = _.join([parseFloat(0).toFixed(6), 'VESTS'], ' ');

  return {
    query: _query,
    type: 'delegate_vesting_shares'
  };
};

const validate = async (query) => {
  const errors = [];
  if (isEmpty(query.delegatee)) {
    errors.push('\'delegatee\' is required');
  } else if (!await userExists(query.delegatee)) {
    errors.push(`the user ${query.delegatee} doesn't exist`);
  }

  return errors;
};

module.exports = {
  normalize,
  validate
};
