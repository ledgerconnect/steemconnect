const _ = require('lodash');
const { isAsset, isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['memo'];

const parse = (query) => {
  const _query = _.cloneDeep(query);
  const [amount, symbol] = _query.amount.split(' ');

  _query.to = normalizeUsername(_query.to);
  _query.amount = _.join([parseFloat(amount).toFixed(3), symbol], ' ');
  _query.memo = _query.memo || '';

  return _query;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.to) && !await userExists(query.to)) {
    errors.push(`the user ${query.following} doesn't exist`);
  }

  if (!isEmpty(query.amount) && !['STEEM', 'SBD'].includes(query.amount.split(' ')[1])) {
    errors.push('please select a valid symbol: STEEM or SBD');
  } else if (!isEmpty(query.amount) && !isAsset(query.amount)) {
    errors.push('please type a valid amount, 12.123 STEEM or 12.123 SBD for example');
  }

  if (errors.length === 0) {
    const [amount, symbol] = query.amount.split(' ');
    // eslint-disable-next-line no-param-reassign
    query.amount = _.join([parseFloat(amount).toFixed(3), symbol], ' ');
  }
};

module.exports = {
  optionalFields,
  parse,
  validate
};
