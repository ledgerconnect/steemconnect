const cloneDeep = require('lodash/cloneDeep');
const join = require('lodash/join');
const steem = require('steem');
const { formatter } = require('steem');
const { isAsset, isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['delegator'];

const parse = async (query) => {
  const cQuery = cloneDeep(query);
  const [amount, symbol] = cQuery.vesting_shares.split(' ');
  const globalProps = await steem.api.getDynamicGlobalPropertiesAsync();

  cQuery.delegatee = normalizeUsername(cQuery.delegatee);
  cQuery.delegator = normalizeUsername(cQuery.delegator);

  if (symbol === 'SP') {
    cQuery.vesting_shares = join([
      (
        (parseFloat(amount) *
        parseFloat(globalProps.total_vesting_shares)) /
        parseFloat(globalProps.total_vesting_fund_steem)
      ).toFixed(6),
      'VESTS',
    ], ' ');
  } else {
    cQuery.vesting_shares = join([parseFloat(amount).toFixed(6), symbol], ' ');
  }

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.delegatee) && !await userExists(query.delegatee)) {
    errors.push({ field: 'delegatee', error: 'error_user_exist', values: { user: query.delegatee } });
  }
  if (!isEmpty(query.delegator) && !await userExists(query.delegator)) {
    errors.push({ field: 'delegator', error: 'error_user_exist', values: { user: query.delegator } });
  }

  if (!isEmpty(query.vesting_shares)) {
    if (!['VESTS', 'SP'].includes(query.vesting_shares.split(' ')[1])) {
      errors.push({ field: 'vesting_shares', error: 'error_vests_symbol' });
    } else if (!isAsset(query.vesting_shares)) {
      errors.push({ field: 'vesting_shares', error: 'error_vests_format' });
    }
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
    }
  }

  const [amount, symbol] = cQuery.vesting_shares.split(' ');
  if (amount && symbol === 'VESTS') {
    const globalProps = await steem.api.getDynamicGlobalPropertiesAsync();
    cQuery.amount = join(
      [
        formatter.vestToSteem(
          cQuery.vesting_shares,
          globalProps.total_vesting_shares,
          globalProps.total_vesting_fund_steem
        ).toFixed(3),
        'SP',
      ], ' ');
  } else if (amount && symbol === 'SP') {
    cQuery.amount = join(
      [parseFloat(amount).toFixed(3), symbol],
      ' ');
  }
  return cQuery;
};

module.exports = {
  normalize,
  optionalFields,
  parse,
  validate,
};
