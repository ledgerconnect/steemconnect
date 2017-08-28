const _ = require('lodash');

const optionalFields = ['memo'];

const parse = (query) => {
  const _query = _.cloneDeep(query);
  _query.memo = _query.memo || '';
  return _query;
};

module.exports = {
  optionalFields,
  parse
};
