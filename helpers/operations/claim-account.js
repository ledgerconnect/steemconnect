const cloneDeep = require('lodash/cloneDeep');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');
const { jsonParse } = require('../utils');

const parse = (query) => {
  const cQuery = cloneDeep(query);
  cQuery.creator = normalizeUsername(cQuery.creator);
  cQuery.fee = cQuery.fee || '0.000 STEEM';
  cQuery.extensions = query.extensions ? jsonParse(query.extensions) : [];

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.creator) && !await userExists(query.creator)) {
    errors.push({ field: 'creator', error: 'error_user_exist', values: { user: query.creator } });
  }
};

module.exports = {
  parse,
  validate,
};
