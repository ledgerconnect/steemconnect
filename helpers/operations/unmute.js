const { isEmpty, userExists } = require('../validation-utils');

const normalize = (query) => {
  const _query = {
    id: 'follow',
    json: JSON.stringify([
      'follow', {
        following: query.following.charAt(0) === '@' ? query.following.substr(1) : query.following,
        what: []
      }
    ]),
    required_auths: [],
    required_posting_auths: [query.follower]
  };

  return {
    query: _query,
    type: 'customJson'
  };
};

const validate = async (query) => {
  const errors = [];

  if (isEmpty(query.following)) {
    errors.push('following is required');
  } else if (!await userExists(query.following)) {
    errors.push(`the user ${query.following} doesn't exist`);
  }

  return errors;
};

module.exports = {
  normalize,
  validate
};
