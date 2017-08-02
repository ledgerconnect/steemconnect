module.exports = [
  {
    roles: ['posting', 'active'],
    operation: 'follow',
    params: ['following']
  },
  {
    roles: ['posting', 'active'],
    operation: 'unfollow',
    params: ['following']
  },
  {
    roles: ['posting', 'active'],
    operation: 'mute',
    params: ['following']
  },
  {
    roles: ['posting', 'active'],
    operation: 'unmute',
    params: ['following']
  },
  {
    roles: ['active'],
    operation: 'undelegate_vesting_shares',
    params: ['delegatee']
  }
];
