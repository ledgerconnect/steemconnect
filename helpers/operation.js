/* eslint-disable no-param-reassign */
const { formatter } = require('steem');
const changeCase = require('change-case');
const diacritics = require('diacritics');
const operations = require('steem/lib/broadcast/operations');
const _ = require('lodash');
const operationAuthor = require('./operation-author.json');

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
  return ops[0] ? ops[0] : '';
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

const parseVote = (query) => {
  query.weight = query.weight || 10000;
  return query;
};

const parseComment = (query) => {
  query.parent_author = query.parent_author || '';
  query.parent_permlink = query.parent_permlink || '';
  query.title = query.title || '';
  if (query.parent_author && query.parent_permlink) {
    query.permlink = query.permlink
      || formatter.commentPermlink(query.parent_author, query.parent_permlink).toLowerCase();
  } else {
    query.title = query.title || query.body.slice(0, 255);
    query.permlink = query.permlink
      || changeCase.paramCase(diacritics.remove(query.title)).slice(0, 255);
  }
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(decodeURIComponent(query.json_metadata)); } catch (e) { jsonMetadata = {}; }
  query.json_metadata = jsonMetadata;
  return query;
};

const parseTransfer = (query) => {
  query.memo = query.memo || '';
  return query;
};

const parseQuery = (type, query, username) => {
  type = changeCase.snakeCase(type);
  query = setDefaultAuthor(type, query, username);

  switch (type) {
    case 'vote':
      return parseVote(query);
    case 'comment':
      return parseComment(query);
    case 'transfer':
      return parseTransfer(query);
    default:
      return query;
  }
};

module.exports = {
  getErrorMessage,
  isOperationAuthor,
  setDefaultAuthor,
  getOperation,
  isValid,
  parseQuery,
};
