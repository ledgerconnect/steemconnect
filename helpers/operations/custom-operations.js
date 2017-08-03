module.exports = [
  {
    roles: ['posting', 'active'],
    operation: 'follow',
    params: ['follower', 'following']
  },
  {
    roles: ['posting', 'active'],
    operation: 'unfollow',
    params: ['follower', 'following']
  },
  {
    roles: ['posting', 'active'],
    operation: 'mute',
    params: ['follower', 'following']
  },
  {
    roles: ['posting', 'active'],
    operation: 'unmute',
    params: ['follower', 'following']
  },
  {
    roles: ['posting', 'active'],
    operation: 'reblog',
    params: ['author', 'permlink']
  },
  {
    roles: ['active'],
    operation: 'undelegate_vesting_shares',
    params: ['delegator', 'delegatee']
  }
];
