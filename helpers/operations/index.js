const comment = require('./comment');
const customjson = require('./custom-json');
const follow = require('./follow');
const mute = require('./mute');
const reblog = require('./reblog');
const transfer = require('./transfer');
const unfollow = require('./unfollow');
const unmute = require('./unmute');
const vote = require('./vote');
const delegateVestingShares = require('./delegate-vesting-shares');
const undelegateVestingShares = require('./undelegate-vesting-shares');

module.exports = {
  comment,
  customjson,
  delegate_vesting_shares: delegateVestingShares,
  undelegate_vesting_shares: undelegateVestingShares,
  follow,
  mute,
  reblog,
  transfer,
  unfollow,
  unmute,
  vote
};
