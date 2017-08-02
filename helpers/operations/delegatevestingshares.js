const _ = require('lodash');
const steem = require('steem');
const { formatter } = require('steem');
const { isAsset, isEmpty, oneOf, userExists } = require('../validation-utils');

const normalize = async (query) => {
  const _query = _.cloneDeep(query);
  const [amount, symbol] = _query.vesting_shares.split(' ');
  const globalProps = await steem.api.getDynamicGlobalPropertiesAsync();

  if (_query.delegatee.charAt(0) === '@') {
    _query.delegatee = _query.delegatee.substr(1);
  }

  if (symbol === 'SP') {
    _query.vesting_shares_display = _.join([parseFloat(amount).toFixed(3), symbol], ' ');
    _query.vesting_shares = _.join([
      (parseFloat(amount) * parseFloat(globalProps.total_vesting_shares) / parseFloat(globalProps.total_vesting_fund_steem)).toFixed(6),
      'VESTS'
    ], ' ');
  } else {
    _query.vesting_shares_display = _.join(
      [
        formatter.vestToSteem(_query.vesting_shares, globalProps.total_vesting_shares, globalProps.total_vesting_fund_steem).toFixed(3),
        'SP'
      ], ' ');
    _query.vesting_shares = _.join([parseFloat(amount).toFixed(6), symbol], ' ');
  }

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

  if (isEmpty(query.vesting_shares)) {
    errors.push('\'vesting_shares\' is required');
  } else if (!oneOf(['VESTS', 'SP'], query.vesting_shares.split(' ')[1])) {
    errors.push('please select a valid symbol: VESTS or SP');
  } else if (!isAsset(query.vesting_shares)) {
    errors.push('please type a valid amount, 12.123 SP or 12.123456 VESTS for example');
  }

  return errors;
};

module.exports = {
  normalize,
  validate
};
