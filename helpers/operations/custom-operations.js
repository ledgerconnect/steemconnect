module.exports = [
  {
    operation: 'follow',
    type: 'custom_json',
    params: ['follower', 'following'],
  },
  {
    operation: 'unfollow',
    type: 'custom_json',
    params: ['follower', 'following'],
  },
  {
    operation: 'reblog',
    type: 'custom_json',
    params: ['author', 'permlink'],
  },
  {
    operation: 'mute',
    type: 'custom_json',
    params: ['follower', 'following'],
  },
  {
    operation: 'unmute',
    type: 'custom_json',
    params: ['follower', 'following'],
  },
  {
    operation: 'undelegate_vesting_shares',
    type: 'delegate_vesting_shares',
    params: ['delegator', 'delegatee'],
  },
  {
    operation: 'update_account',
    type: 'account_update',
    params: ['account'],
  },
];
