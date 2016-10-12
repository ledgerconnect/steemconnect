module.exports = {
  vote: { name: 'Vote/Downvote', paths: ['/api/vote', '/api/upvote', '/api/downvote'] },
  comment: { name: 'Comment', paths: ['/api/comment', '/api/deleteComment'] },
  post: { name: 'Post', paths: ['/api/post'] },
  escrow: { name: 'Escrow', paths: ['/api/escrowTransfer', '/api/escrowDispute', '/api/escrowRelease'] },
  reblog: { name: 'Reblog', paths: ['/api/reblog'] },
  follow: { name: 'Follow/Mute', paths: ['/api/follow', '/api/unfollow', '/api/ignore'] },
};
