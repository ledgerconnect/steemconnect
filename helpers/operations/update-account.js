const customOperations = require('./custom-operations');

const optionalFields = ['account'];

const parse = (query) => {
  const profile = {};

  const op = customOperations.find(o => o.type === 'account_update');
  const keys = Object.keys(query);
  for (let i = 0; i < keys.length; i += 1) {
    if (!op.params.includes(keys[i])) {
      profile[keys[i]] = query[keys[i]];
    }
  }

  const cQuery = {
    json_metadata: JSON.stringify(profile),
  };

  return cQuery;
};

module.exports = {
  optionalFields,
  parse,
};
