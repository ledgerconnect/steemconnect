module.exports = [
  {
    operation: 'follow',
    type: 'custom_json',
    params: ['follower', 'following']
  },
  {
    operation: 'unfollow',
    type: 'custom_json',
    params: ['follower', 'following']
  },
  {
    operation: 'reblog',
    type: 'custom_json',
    params: ['author', 'permlink']
  },
  {
    operation: 'mute',
    type: 'custom_json',
    params: ['follower', 'following']
  },
];
