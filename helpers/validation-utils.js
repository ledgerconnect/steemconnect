const steem = require('steem');

const isEmpty = value => value === undefined || value === null || value === '';

const isAsset = (value) => {
  const allowedSymbols = [
    { symbol: 'SBD', precision: 3 },
    { symbol: 'STEEM', precision: 3 },
    { symbol: 'SP', precision: 3 },
    { symbol: 'VESTS', precision: 6 },
  ];

  if (!/^[0-9]+\.?[0-9]* [A-Za-z0-9]+$/.test(value)) {
    return false;
  }

  const [amount, symbol] = value.split(' ');
  const symbolInfo = allowedSymbols.find(s => s.symbol === symbol);

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

const normalizeUsername = username => ((username && username.charAt(0) === '@') ? username.substr(1) : username);

const userExists = async (username) => {
  const _username = normalizeUsername(username);
  const accounts = await steem.api.getAccountsAsync([_username]);
  return accounts && accounts.length > 0 && accounts.find(a => a.name === _username);
};

const contentExists = async (auhtor, permlink) => {
  const content = await steem.api.getContent(auhtor, permlink);
  return parseInt(content.id) !== 0;
};

module.exports = {
  contentExists,
  isAsset,
  isEmpty,
  normalizeUsername,
  userExists,
};
