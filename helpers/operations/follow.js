const parse = (query) => {
  const _query = {
    id: 'follow',
    json: JSON.stringify([
      'follow', {
        follower: query.follower,
        following: query.following,
        what: query.what ? JSON.parse(query.what) : ['blog', 'posts']
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

module.exports = parse;
