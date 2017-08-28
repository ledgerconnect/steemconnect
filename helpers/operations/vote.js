const _ = require('lodash');
const { contentExists } = require('../validation-utils');

const optionalFields = ['weight'];

const parse = (query) => {
  const _query = _.cloneDeep(query);
  _query.weight = _query.weight || 10000;
  return _query;
};

const validate = async (query, errors) => {
  if (errors.length === 0 && !await contentExists(query.author, query.permlink)) {
    errors.push('the post doesn\'t exist');
  }
  return errors;
};

module.exports = {
  optionalFields,
  parse,
  validate,
};
