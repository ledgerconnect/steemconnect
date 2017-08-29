module.exports = [
  {
    operation: 'follow',
    type: 'custom_json',
    params: ['follower', 'following']
  },
  {
    roles: ['posting', 'active'],
    operation: 'unfollow',
    params: ['follower', 'following']
  }
];
