const _ = require('lodash');

/** Parse error message from Steemd response */
const getErrorMessage = error => (_.has(error, 'payload.error.data.stack[0].format') ? error.payload.error.data.stack[0].format : '');

const queryOperationFields = {
  vote: 'voter',
  comment: 'author',
  transfer: 'from',
  custom_json: 'required_posting_auths[0]'
};

const isOperationAuthor = (operation, query, username) => {
  if (Object.prototype.hasOwnProperty.call(queryOperationFields, operation)) {
    const field = queryOperationFields[operation];
    if (!field) { return false; }

    return _.get(query, field) === username;
  }
  return false;
};

const setDefaultAuthor = (operation, query, username) => {
  const _query = query;
  if (Object.prototype.hasOwnProperty.call(queryOperationFields, operation)) {
    const field = queryOperationFields[operation];
    if (!field) { return _query; }

    if (!_.get(query, field)) { _.set(query, field, username); }
  }
  return _query;
};

module.exports = {
  getErrorMessage,
  setDefaultAuthor,
  isOperationAuthor
};
