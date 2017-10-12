const _ = require('lodash');
const steem = require('steem');
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

  if (!isEmpty(query.from) && !await userExists(query.from)) {
    errors.push({ field: 'from', error: `the user ${query.from} doesn't exist` });
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

const normalize = async (query) => {
  const cQuery = _.cloneDeep(query);
  let sUsername = normalizeUsername(query.to);
  let accounts = await steem.api.getAccountsAsync([sUsername]);
  let account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
  if (account) {
    cQuery.toName = account.name;
    cQuery.toReputation = steem.formatter.reputation(account.reputation);
  }

  if (query.from) {
    sUsername = normalizeUsername(query.from);
    accounts = await steem.api.getAccountsAsync([sUsername]);
    account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
    if (account) {
      cQuery.fromName = account.name;
    }
  }

  return cQuery;
};

module.exports = {
  normalize,
  optionalFields,
  parse,
  validate,
};
