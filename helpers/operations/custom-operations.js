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
  }
];
