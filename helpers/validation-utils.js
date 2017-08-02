const steem = require('steem');

const isEmpty = value => value === undefined || value === null || value === '';

const isAsset = (value) => {
  const allowedSymbol = [
    { symbol: 'SBD', precision: 3 },
    { symbol: 'STEEM', precision: 3 },
    { symbol: 'SP', precision: 3 },
    { symbol: 'VESTS', precision: 6 }
  ];

  if (!/^[0-9]+\.?[0-9]* [A-Za-z0-9]+$/.test(value)) {
    return false;
  }

  const [amount, symbol] = value.split(' ');
  const symbolInfo = allowedSymbol.find(s => s.symbol === symbol);

  if (!symbolInfo) {
    return false;
  }

  const dot = amount.indexOf('.');
  const p = dot === -1 ? 0 : amount.length - dot - 1;

  if (p > symbolInfo.precision) {
    return false;
  }

  return true;
};

const userExists = async (username) => {
  const accounts = await steem.api.getAccountsAsync([username]);
  return accounts && accounts.length > 0;
};

const oneOf = (enumeration, value) => enumeration.indexOf(value) !== -1;

module.exports = {
  isAsset,
  isEmpty,
  oneOf,
  userExists
};