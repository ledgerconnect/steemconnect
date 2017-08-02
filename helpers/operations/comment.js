const _ = require('lodash');
const { formatter } = require('steem');
const changeCase = require('change-case');
const diacritics = require('diacritics');
const { isEmpty } = require('../validation-utils');

const normalize = (query) => {
  const _query = _.cloneDeep(query);

  _query.parent_author = _query.parent_author || '';
  _query.parent_permlink = _query.parent_permlink || '';
  _query.title = _query.title || '';
  if (_query.parent_author && _query.parent_permlink) {
    _query.permlink = _query.permlink
      || formatter.commentPermlink(_query.parent_author, _query.parent_permlink).toLowerCase();
  } else {
    _query.title = _query.title || _query.body.slice(0, 255);
    _query.permlink = _query.permlink
      || changeCase.paramCase(diacritics.remove(_query.title)).slice(0, 255);
  }
  let jsonMetadata = {};
  try {
    jsonMetadata = JSON.parse(decodeURIComponent(_query.json_metadata));
  } catch (e) {
    jsonMetadata = {};
  }
  _query.json_metadata = jsonMetadata;
  return {
    query: _query,
    type: 'comment'
  };
};

const validate = (query) => {
  const errors = [];

  if (isEmpty(query.body)) {
    errors.push('body is required');
  }
  if (isEmpty(query.permlink)) {
    errors.push('permlink is required');
  }

  return errors;
};

module.exports = {
  normalize,
  validate
};