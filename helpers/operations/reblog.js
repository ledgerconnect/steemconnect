const { contentExists, normalizeUsername } = require('../validation-utils');

const parse = (query) => {
  const cQuery = {
    id: 'follow',
    json: JSON.stringify([
      'reblog', {
        account: query.required_posting_auths[0],
        author: normalizeUsername(query.author),
        permlink: query.permlink,
      },
    ]),
    required_auths: [],
    required_posting_auths: query.required_posting_auths,
  };

  return cQuery;
};

const validate = async (query, errors) => {
  if (errors.length === 0 && !await contentExists(query.author, query.permlink)) {
    errors.push({ field: 'permlink', error: 'error_post_exist' });
  }
};

module.exports = {
  parse,
  validate,
};
