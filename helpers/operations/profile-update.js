const changeCase = require('change-case');
const customOperations = require('./custom-operations');
const steem = require('steem');

const optionalFields = ['account'];

const parse = async (query) => {
  const accounts = await steem.api.getAccountsAsync([query.account]);
  const account = accounts.find(a => a.name === query.account);
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
    account: query.account,
    memo_key: account.memo_key,
    json_metadata: JSON.stringify(jsonMetadata),
  };

  return cQuery;
};

module.exports = {
  optionalFields,
  parse,
};
