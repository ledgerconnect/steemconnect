const profileUpdate = require('./profile-update');
const comment = require('./comment');
const customJson = require('./custom-json');
const delegateVestingShares = require('./delegate-vesting-shares');
const follow = require('./follow');
const mute = require('./mute');
const reblog = require('./reblog');
const transfer = require('./transfer');
const undelegateVestingShares = require('./undelegate-vesting-shares');
const unfollow = require('./unfollow');
const unmute = require('./unmute');
const vote = require('./vote');

module.exports = {
  comment,
  custom_json: customJson,
  delegate_vesting_shares: delegateVestingShares,
  follow,
  mute,
  reblog,
  transfer,
  undelegate_vesting_shares: undelegateVestingShares,
  unfollow,
  unmute,
  profile_update: profileUpdate,
  vote,
};
