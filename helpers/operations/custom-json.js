const _ = require('lodash');
const { isEmpty } = require('../validation-utils');

const normalize = (query) => {
  const _query = _.cloneDeep(query);

  _query.required_posting_auths = JSON.parse(_query.required_posting_auths);

  return {
    query: _query,
    type: 'custom_json'
  };
};

const validate = async (query) => {
  const errors = [];

  if (isEmpty(query.id)) {
    errors.push('id is required');
  }

  if (isEmpty(query.json)) {
    errors.push('json is required');
  }

  if (isEmpty(query.required_posting_auths)) {
    errors.push('required_posting_auths is required');
  }

  return errors;
};

module.exports = {
  normalize,
  validate
};
