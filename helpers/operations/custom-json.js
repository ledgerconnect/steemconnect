const _ = require('lodash');
const { userExists, isEmpty } = require('../validation-utils');

const optionalFields = ['required_auths', 'required_posting_auths'];

const parse = (query) => {
  const cQuery = _.cloneDeep(query);
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
      errors.push({ field: 'required_auths', error: 'required_auths is not a JSON valid field' });
    }
  }
  if (!isEmpty(query.required_posting_auths)) {
    try {
      const auths = JSON.parse(query.required_posting_auths);
      for (let i = 0; i < auths.length; i += 1) {
        if (!await userExists(auths[i])) {
          errors.push({ field: 'required_posting_auths', error: `the user ${auths[i]} doesn't exist` });
        }
      }
    } catch (err) {
      errors.push({ field: 'required_posting_auths', error: 'required_posting_auths is not a JSON valid field' });
    }
  }
};

module.exports = {
  optionalFields,
  parse,
  validate,
};
