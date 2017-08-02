const comment = require('./comment');
const customjson = require('./customjson');
const follow = require('./follow');
const mute = require('./mute');
const transfer = require('./transfer');
const unfollow = require('./unfollow');
const unmute = require('./unmute');
const vote = require('./vote');
const delegatevestingshares = require('./delegatevestingshares');
const undelegatevestingshares = require('./undelegatevestingshares');

module.exports = {
  comment,
  customjson,
  delegatevestingshares,
  undelegatevestingshares,
  follow,
  mute,
  transfer,
  unfollow,
  unmute,
  vote
};
