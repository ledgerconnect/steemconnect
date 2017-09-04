const changeCase = require('change-case');
const customOperations = require('./custom-operations');

const optionalFields = ['account'];

const parse = (query) => {
  const jsonMetadata = { profile: {} };

  const op = customOperations.find(o => o.type === 'account_update');
  const keys = Object.keys(query);
  for (let i = 0; i < keys.length; i += 1) {
    if (!op.params.includes(keys[i])) {
      jsonMetadata.profile[changeCase.snakeCase(keys[i])] = query[keys[i]];
    }
  }

  const cQuery = {
    account: query.account,
    memo_key: query.memo_key,
    json_metadata: JSON.stringify(jsonMetadata),
  };

  return cQuery;
};

module.exports = {
  optionalFields,
  parse,
};
