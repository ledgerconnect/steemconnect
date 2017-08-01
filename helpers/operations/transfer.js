const _ = require('lodash');
const { isEmpty, isAsset } = require('../validation-utils');

const parse = (query) => {
  const _query = _.cloneDeep(query);

  _query.memo = query.memo || '';
  return {
    query: _query,
    type: 'transfer'
  };
};

const validate = (query) => {
  const errors = [];

  if (isEmpty(query.to)) {
    errors.push('to is required');
  }

  if (isEmpty(query.amount)) {
    errors.push('amount is required');
  } else if (!isAsset(query.amount, 3)) {
    errors.push('please type a valid amount, 12.345 STEEM for example');
  }

  return errors;
};

module.exports = {
  parse,
  validate
};
