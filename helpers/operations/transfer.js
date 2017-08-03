const _ = require('lodash');
const { isAsset, isEmpty, oneOf, userExists, normalizeUsername } = require('../validation-utils');

const normalize = (query) => {
  const _query = _.cloneDeep(query);
  const [amount, symbol] = _query.amount.split(' ');

  _query.to = normalizeUsername(_query.to);

  _query.amount = _.join([(symbol === 'VESTS' || symbol === 'SP') ? parseFloat(amount).toFixed(6) : parseFloat(amount).toFixed(3), symbol], ' ');
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
  } else if (!oneOf(['STEEM', 'SBD'], query.amount.split(' ')[1])) {
    errors.push('please select a valid symbol: STEEM or SBD');
  } else if (!isAsset(query.amount)) {
    errors.push('please type a valid amount, 12.123 STEEM or 12.123 SBD for example');
  }

  return errors;
};

module.exports = {
  normalize,
  validate
};
