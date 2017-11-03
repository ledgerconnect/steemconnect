const cloneDeep = require('lodash/cloneDeep');
const { userExists, isEmpty } = require('../validation-utils');

const optionalFields = ['required_auths', 'required_posting_auths'];

const parse = (query) => {
  const cQuery = cloneDeep(query);
  if (cQuery.required_auths) {
    cQuery.required_auths = JSON.parse(cQuery.required_auths);
  }
  if (cQuery.required_posting_auths) {
    try {
      cQuery.required_posting_auths = JSON.parse(cQuery.required_posting_auths);
    } catch (err) {
      // do nothing, try to parse in case this is not the default value
    }
  }
  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.required_auths)) {
    try {
      JSON.parse(query.required_auths);
    } catch (err) {
      errors.push({ field: 'required_auths', error: 'error_json_valid', values: { field: 'required_auths' } });
    }
  }
  if (!isEmpty(query.required_posting_auths)) {
    try {
      const auths = JSON.parse(query.required_posting_auths);
      for (let i = 0; i < auths.length; i += 1) {
        if (!await userExists(auths[i])) {
          errors.push({ field: 'required_posting_auths', error: 'error_user_exist', values: { user: auths[i] } });
        }
      }
    } catch (err) {
      errors.push({ field: 'required_posting_auths', error: 'error_json_valid', values: { field: 'required_posting_auths' } });
    }
  }
};

module.exports = {
  optionalFields,
  parse,
  validate,
};
