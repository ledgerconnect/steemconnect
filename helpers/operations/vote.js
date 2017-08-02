const _ = require('lodash');
const { isEmpty } = require('../validation-utils');

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
  if (isEmpty(query.author)) {
    errors.push('\'author\' is required');
  }
  if (isEmpty(query.permlink)) {
    errors.push('\'permlink\' is required');
  }
  return errors;
};

module.exports = {
  parse,
  validate
};
