const _ = require('lodash');
const { contentExists, isEmpty } = require('../validation-utils');

const parse = (query) => {
  const _query = _.cloneDeep(query);
  _query.weight = _query.weight || 10000;
  return _query;
};

const validate = async (query) => {
  const errors = [];
  if (isEmpty(query.author)) {
    errors.push('\'author\' is required');
  }
  if (isEmpty(query.permlink)) {
    errors.push('\'permlink\' is required');
  }
  if (errors.length === 0 && !await contentExists(query.author, query.permlink)) {
    errors.push('the post doesn\'t exist');
  }
  return errors;
};

module.exports = {
  validate,
  parse
};
