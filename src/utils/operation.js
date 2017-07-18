import { formatter } from 'steem';
import _ from 'lodash';
import changeCase from 'change-case';
import diacritics from 'diacritics';
import operations from 'steem/lib/broadcast/operations';

export const getOperation = type => {
  const ops = operations.filter(op =>
    op.operation === changeCase.snakeCase(type)
  );
  return ops[0] ? ops[0] : '';
};

export const isValid = (op, params) => {
  let isValid = false;
  if (op) {
    isValid = true;
    op.params.forEach((param) => {
      if (params[param] === undefined) {
        isValid = false;
      }
    });
  }
  return isValid;
};

export const parseQuery = (type, query, username) => {
  type = changeCase.snakeCase(type);
  switch (type) {
    case 'vote':
      return parseVote(query, username);
    case 'comment':
      return parseComment(query, username);
    case 'transfer':
      return parseTransfer(query, username);
    default:
      return query;
  }
};

export const parseVote = (query, username) => {
  query.voter = query.voter || username;
  query.weight = query.weight || 10000;
  return query;
};

export const getErrorMessage = (error) => {
  return _.has(error, 'payload.error.data.stack[0].format')
    ? error.payload.error.data.stack[0].format
    : '';
};

export const parseComment = (query, username) => {
  query.author = query.author || username;
  query.parent_author = query.parent_author || '';
  query.parent_permlink =  query.parent_permlink || '';
  query.title = query.title || '';
  if (query.parent_author && query.parent_permlink) {
    query.permlink = query.permlink
      || formatter.commentPermlink(query.parent_author, query.parent_permlink).toLowerCase()
  } else {
    query.title = query.title || query.body.slice(0, 255);
    query.permlink = query.permlink
      || changeCase.paramCase(diacritics.remove(query.title)).slice(0, 255)
  }
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(decodeURIComponent(query.json_metadata)); }
  catch (e) { jsonMetadata = {}; }
  query.json_metadata = jsonMetadata;
  return query;
};

export const parseTransfer = (query, username) => {
  query.from = query.from || username;
  query.memo = query.memo || '';
  return query;
};
