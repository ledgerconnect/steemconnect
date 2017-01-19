import { formatter } from 'steem';
import changeCase from 'change-case';
import diacritics from 'diacritics';
import operations from 'steem/lib/broadcast/operations.json';

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
    default:
      return query;
  }
};

export const parseVote = (query, username) => {
  query.voter = query.voter || username;
  query.weight = query.weight || 10000;
  return query;
};

export const parseComment = (query, username) => {
  query.author = query.author || username;
  if (query.parent_author && query.parent_permlink) {
    query.title = query.title || '';
    query.permlink = query.permlink
      || formatter.commentPermlink(query.parent_author, query.parent_permlink).toLowerCase()
  } else {
    query.title = query.title || query.body.slice(0, 255);
    query.permlink = query.permlink
      || changeCase.paramCase(diacritics.remove(query.title)).slice(0, 255)
  }
  query.json_metadata = query.json_metadata || '';
  return query;
};
