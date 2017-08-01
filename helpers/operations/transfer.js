const _ = require('lodash');

const parse = (query) => {
  const _query = _.cloneDeep(query);

  _query.memo = query.memo || '';
  return {
    query: _query,
    type: 'transfer'
  };
};

module.exports = parse;
