const _ = require('lodash');
const { isAsset, isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['memo'];

const parse = (query) => {
  const cQuery = _.cloneDeep(query);
  const [amount, symbol] = cQuery.amount.split(' ');

  cQuery.to = normalizeUsername(cQuery.to);
  cQuery.amount = _.join([parseFloat(amount).toFixed(3), symbol], ' ');
  cQuery.memo = cQuery.memo || '';

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.to) && !await userExists(query.to)) {
    errors.push({ field: 'to', error: `the user ${query.to} doesn't exist` });
  }

  if (!isEmpty(query.amount) && !['STEEM', 'SBD'].includes(query.amount.split(' ')[1])) {
    errors.push({ field: 'amount', error: 'please select a valid symbol: STEEM or SBD' });
  } else if (!isEmpty(query.amount) && !isAsset(query.amount)) {
    errors.push({ field: 'amount', error: 'please type a valid amount, 12.123 STEEM or 12.123 SBD for example' });
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
  validate,
};
