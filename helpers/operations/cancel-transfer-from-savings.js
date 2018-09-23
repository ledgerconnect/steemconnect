const cloneDeep = require('lodash/cloneDeep');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const parse = (query) => {
  const cQuery = cloneDeep(query);
  cQuery.from = normalizeUsername(cQuery.from);
  cQuery.request_id = parseInt(cQuery.request_id, 10);

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.from) && !await userExists(query.from)) {
    errors.push({ field: 'from', error: 'error_user_exist', values: { user: query.from } });
  }
};

module.exports = {
  parse,
  validate,
};
