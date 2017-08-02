const comment = require('./comment');
const follow = require('./follow');
const transfer = require('./transfer');
const unfollow = require('./unfollow');
const vote = require('./vote');
const delegatevestingshares = require('./delegatevestingshares');
const undelegatevestingshares = require('./undelegatevestingshares');

module.exports = {
  comment,
  delegatevestingshares,
  undelegatevestingshares,
  follow,
  transfer,
  unfollow,
  vote
};
