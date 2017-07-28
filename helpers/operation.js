const _ = require('lodash');
const operationAuthor = require('./operation-author.json');

/** Parse error message from Steemd response */
const getErrorMessage = (error) => {
  return _.has(error, 'payload.error.data.stack[0].format')
    ? error.payload.error.data.stack[0].format
    : '';
};

const isOperationAuthor = (operation, query, username) => {
  if (Object.prototype.hasOwnProperty.call(operationAuthor, operation)) {
    const field = operationAuthor[operation];
    if (!field) { return false; }
    return _.get(query, field) === username;
  }
  return false;
};

const setDefaultAuthor = (operation, query, username) => {
  const _query = query;
  if (Object.prototype.hasOwnProperty.call(operationAuthor, operation)) {
    const field = operationAuthor[operation];
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
