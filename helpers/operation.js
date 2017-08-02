/* eslint-disable no-param-reassign */
const changeCase = require('change-case');
const operations = require('steem/lib/broadcast/operations');
const customOperations = require('./operations/custom-operations');
const _ = require('lodash');
const operationAuthor = require('./operation-author.json');
const parseOperations = require('./operations');

/** Parse error message from Steemd response */
const getErrorMessage = (error) => {
  let errorMessage = '';
  if (_.has(error, 'payload.error.data.stack[0].format')) {
    errorMessage = error.payload.error.data.stack[0].format;
    if (_.has(error, 'payload.error.data.stack[0].data')) {
      const data = error.payload.error.data.stack[0].data;
      Object.keys(data).forEach((d) => {
        errorMessage = errorMessage.split('${' + d + '}').join(data[d]); // eslint-disable-line prefer-template
      });
    }
  }
  return errorMessage;
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

const getOperation = (type) => {
  const ops = operations.filter(op =>
    op.operation === changeCase.snakeCase(type)
  );
  if (ops[0]) {
    return ops[0];
  }
  const cOps = customOperations.filter(op =>
    op.operation === changeCase.snakeCase(type)
  );

  return cOps[0] ? cOps[0] : '';
};

const isValid = (op, params) => {
  let valid = false;
  if (op) {
    valid = true;
    op.params.forEach((param) => {
      if (params[param] === undefined) {
        valid = false;
      }
    });
  }
  return valid;
};

const validate = async (type, query) => {
  type = changeCase.snakeCase(type);
  let errors = [];
  if (_.hasIn(parseOperations, _.replace(type, /_/g, ''))) {
    errors = await parseOperations[_.replace(type, /_/g, '')].validate(query);
  }
  return {
    errors
  };
};

const normalize = async (type, query) => {
  type = changeCase.snakeCase(type);
  if (_.hasIn(parseOperations, _.replace(type, /_/g, ''))) {
    return parseOperations[_.replace(type, /_/g, '')].normalize(query);
  }
  return {
    query,
    type
  };
};

module.exports = {
  getErrorMessage,
  isOperationAuthor,
  setDefaultAuthor,
  getOperation,
  isValid,
  normalize,
  validate
};
