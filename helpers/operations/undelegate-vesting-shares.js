const cloneDeep = require('lodash/cloneDeep');
const join = require('lodash/join');
const steem = require('@steemit/steem-js');
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

const normalize = async (query) => {
  const cQuery = cloneDeep(query);

  let sUsername = normalizeUsername(query.delegatee);
  let accounts = await steem.api.getAccountsAsync([sUsername]);
  let account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
  if (account) {
    cQuery.toName = account.name;
    cQuery.toReputation = steem.formatter.reputation(account.reputation);
  }

  if (query.delegator) {
    sUsername = normalizeUsername(query.delegator);
    accounts = await steem.api.getAccountsAsync([sUsername]);
    account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
    if (account) {
      cQuery.fromName = account.name;
      cQuery.fromReputation = steem.formatter.reputation(account.reputation);
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
