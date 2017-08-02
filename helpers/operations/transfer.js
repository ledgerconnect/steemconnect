const _ = require('lodash');
const { isEmpty, isAsset, userExists } = require('../validation-utils');

const parse = (query) => {
  const _query = _.cloneDeep(query);

  _query.memo = query.memo || '';
  return {
    query: _query,
    type: 'transfer'
  };
};

const validate = async (query) => {
  const errors = [];

  if (isEmpty(query.to)) {
    errors.push('\'to\' is required');
  } else if (!await userExists(query.to)) {
    errors.push(`the user ${query.to} doesn't exist`);
  }

  if (isEmpty(query.amount)) {
    errors.push('amount is required');
  } else if (!isAsset(query.amount)) {
    errors.push('please type a valid amount, 12.123 STEEM or 12.123456 VESTS for example');
  }

  return errors;
};

module.exports = {
  parse,
  validate
};
