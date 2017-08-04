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

const customJsonSpecial = (operation, query) => {
  if (operation === 'follow' || operation === 'unfollow' || operation === 'mute' || operation === 'unmute' || operation === 'reblog') {
    if (typeof query.json === 'string') {
      query.json = JSON.parse(query.json);
    } else {
      query.json = JSON.stringify(query.json);
    }
  }
  return query;
};

const setDefaultAuthor = (operation, query, username) => {
  const _query = _.cloneDeep(query);
  customJsonSpecial(operation, _query);
  if (Object.prototype.hasOwnProperty.call(operationAuthor, operation)) {
    const field = operationAuthor[operation];
    if (!field) { return _query; }
    if (Array.isArray(field)) {
      field.forEach((f) => {
        if (!_.get(_query, f)) {
          _.set(_query, f, username);
        }
      });
    } else if (!_.get(_query, field)) {
      _.set(_query, field, username);
    }
  }
  customJsonSpecial(operation, _query);
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
  if (_.hasIn(parseOperations, type)) {
    errors = await parseOperations[type].validate(query);
  }
  return {
    errors
  };
};

const normalize = async (type, query) => {
  type = changeCase.snakeCase(type);
  if (_.hasIn(parseOperations, type)) {
    return parseOperations[type].normalize(query);
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
