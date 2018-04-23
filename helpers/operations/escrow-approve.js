const cloneDeep = require('lodash/cloneDeep');
const validator = require('validator');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const parse = (query) => {
  const cQuery = cloneDeep(query);
  cQuery.to = normalizeUsername(cQuery.to);
  cQuery.from = normalizeUsername(cQuery.from);
  cQuery.agent = normalizeUsername(cQuery.agent);
  cQuery.who = normalizeUsername(cQuery.who);
  cQuery.escrow_id = parseInt(cQuery.escrow_id, 0);

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.to) && !await userExists(query.to)) {
    errors.push({ field: 'to', error: 'error_user_exist', values: { user: query.to } });
  }

  if (!isEmpty(query.from) && !await userExists(query.from)) {
    errors.push({ field: 'from', error: 'error_user_exist', values: { user: query.from } });
  }

  if (!isEmpty(query.agent) && !await userExists(query.agent)) {
    errors.push({ field: 'agent', error: 'error_user_exist', values: { user: query.agent } });
  }

  if (!isEmpty(query.who) && !await userExists(query.who)) {
    errors.push({ field: 'who', error: 'error_user_exist', values: { user: query.who } });
  }

  if (query.who !== query.agent && query.who !== query.to) {
    errors.push({ field: 'who', error: 'error_user_equals', values: { field: 'who', userA: query.agent, userB: query.to } });
  }

  if (!validator.isInt(query.escrow_id)) {
    errors.push({ field: 'escrow_id', error: 'error_integer_format' });
  }

  if (!validator.isBoolean(query.approve)) {
    errors.push({ field: 'approve', error: 'error_boolean_format' });
  }
};

module.exports = {
  parse,
  validate,
};
