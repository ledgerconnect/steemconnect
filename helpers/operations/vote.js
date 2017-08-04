const _ = require('lodash');

const parse = (query) => {
  const _query = _.cloneDeep(query);
  _query.weight = _query.weight || 10000;
  return _query;
};

module.exports = {
  parse
};
