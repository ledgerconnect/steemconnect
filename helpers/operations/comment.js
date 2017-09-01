const _ = require('lodash');
const { formatter } = require('steem');
const changeCase = require('change-case');
const diacritics = require('diacritics');

const optionalFields = ['parent_author', 'parent_permlink', 'title', 'json_metadata'];

const parse = (query) => {
  const cQuery = _.cloneDeep(query);
  cQuery.parent_author = cQuery.parent_author || '';
  cQuery.parent_permlink = cQuery.parent_permlink || '';
  cQuery.title = cQuery.title || '';
  if (cQuery.parent_author && cQuery.parent_permlink) {
    cQuery.permlink = cQuery.permlink
      || formatter.commentPermlink(cQuery.parent_author, cQuery.parent_permlink).toLowerCase();
  } else {
    cQuery.title = cQuery.title || cQuery.body.slice(0, 255);
    cQuery.permlink = cQuery.permlink
      || changeCase.paramCase(diacritics.remove(cQuery.title)).slice(0, 255);
  }
  let jsonMetadata = {};
  try {
    jsonMetadata = JSON.parse(decodeURIComponent(cQuery.json_metadata));
  } catch (e) {
    jsonMetadata = {};
  }
  cQuery.json_metadata = jsonMetadata;
  return cQuery;
};

module.exports = {
  optionalFields,
  parse,
};
