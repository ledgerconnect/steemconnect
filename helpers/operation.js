const changeCase = require('change-case');
const operations = require('steem/lib/broadcast/operations');
const _ = require('lodash');
const operationAuthor = require('./operation-author.json');
const customOperations = require('./operations/custom-operations');
const helperOperations = require('./operations');

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
  const _query = _.cloneDeep(query);

  if (Object.prototype.hasOwnProperty.call(operationAuthor, operation)) {
    const field = operationAuthor[operation];
    if (!field) { return _query; }
    if (!_.get(_query, field)) { _.set(_query, field, username); }
  }
  return _query;
};

const getOperation = (type) => {
  let ops = operations.filter(op =>
    op.operation === changeCase.snakeCase(type)
  );
  if (ops[0]) {
    return ops[0];
  }

  ops = customOperations.filter(op =>
      op.operation === changeCase.snakeCase(type)
  );
  if (ops[0]) {
    return ops[0];
  }

  return '';
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

const parseQuery = (type, query, username) => {
  const snakeCaseType = changeCase.snakeCase(type);
  let _query = _.cloneDeep(query);
  _query = setDefaultAuthor(snakeCaseType, _query, username);

  if (_.hasIn(helperOperations, snakeCaseType)) {
    return helperOperations[snakeCaseType].parse(_query);
  }

  return _query;
};

const validateRequired = (type, query) => {
  const errors = [];
  let operation = operations.find(o => o.operation === type);
  if (!operation) {
    operation = customOperations.find(o => o.operation === type);
  }
  if (operation) {
    let authorField;
    let optionalFields = [];

    if (Object.prototype.hasOwnProperty.call(operationAuthor, type)) {
      authorField = operationAuthor[type];
    }

    if (_.hasIn(helperOperations, type) && helperOperations[type].optionalFields) {
      optionalFields = helperOperations[type].optionalFields;
    }

    operation.params.forEach((p) => {
      if (!optionalFields.includes(p) && !query[p] && (!authorField || p !== authorField)) {
        errors.push(`${p} is required`);
      }
    });
  }

  return errors;
};

const validate = async (type, query) => {
  const snakeCaseType = changeCase.snakeCase(type);
  const errors = validateRequired(snakeCaseType, query);
  if (_.hasIn(helperOperations, snakeCaseType) && typeof helperOperations[snakeCaseType].validate === 'function') {
    await helperOperations[snakeCaseType].validate(query, errors);
  }
  return errors;
};

module.exports = {
  getErrorMessage,
  isOperationAuthor,
  setDefaultAuthor,
  getOperation,
  isValid,
  parseQuery,
  validate
};
