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
    roles: ['active'],
    operation: 'delegatevestingshares',
    params: ['delegator', 'delegatee', 'vesting_shares']
  },
  {
    roles: ['active'],
    operation: 'undelegatevestingshares',
    params: ['delegator', 'delegatee', 'vesting_shares']
  }
];
