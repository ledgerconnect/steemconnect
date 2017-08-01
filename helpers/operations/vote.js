const _ = require('lodash');

const parse = (query) => {
  const _query = _.cloneDeep(query);
  _query.weight = _query.weight || 10000;
  return {
    query: _query,
    type: 'vote'
  };
};

const validate = (query) => {
  const errors = [];

  return errors;
};

module.exports = {
  parse,
  validate
};
