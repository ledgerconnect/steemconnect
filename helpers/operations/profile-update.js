const changeCase = require('change-case');
const { userExists, isEmpty, normalizeUsername } = require('../validation-utils');
const customOperations = require('./custom-operations');
const steem = require('steem');

const parse = async (query) => {
  const username = normalizeUsername(query.account);
  const accounts = await steem.api.getAccountsAsync([username]);
  const account = accounts.find(a => a.name === username);
  let jsonMetadata = {};

  if (account.json_metadata) {
    jsonMetadata = JSON.parse(account.json_metadata);
  }
  if (!jsonMetadata.profile) {
    jsonMetadata.profile = {};
  }

  const op = customOperations.find(o => o.type === 'account_update');
  const keys = Object.keys(query);
  for (let i = 0; i < keys.length; i += 1) {
    if (!op.params.includes(keys[i])) {
      jsonMetadata.profile[changeCase.snakeCase(keys[i])] = query[keys[i]];
    }
  }

  const cQuery = {
    account: username,
    memo_key: account.memo_key,
    json_metadata: JSON.stringify(jsonMetadata),
  };

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.account) && !await userExists(query.account)) {
    errors.push({ field: 'account', error: 'error_user_exist', values: { user: query.account } });
  }
};

module.exports = {
  parse,
  validate,
};
