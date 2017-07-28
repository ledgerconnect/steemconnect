/* eslint-disable no-param-reassign */
import { formatter } from 'steem';
import _ from 'lodash';
import changeCase from 'change-case';
import diacritics from 'diacritics';
import operations from 'steem/lib/broadcast/operations';
import { setDefaultAuthor } from '../../helpers/operation';

export const getOperation = (type) => {
  const ops = operations.filter(op =>
    op.operation === changeCase.snakeCase(type)
  );
  return ops[0] ? ops[0] : '';
};

export const isValid = (op, params) => {
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

export const parseVote = (query) => {
  query.weight = query.weight || 10000;
  return query;
};

export const parseComment = (query) => {
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

export const parseTransfer = (query) => {
  query.memo = query.memo || '';
  return query;
};

export const parseQuery = (type, query, username) => {
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

export const getErrorMessage = error => (_.has(error, 'payload.error.data.stack[0].format')
    ? error.payload.error.data.stack[0].format
    : '');
