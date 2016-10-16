module.exports = {
  vote: { name: 'Vote', paths: ['/api/vote', '/api/upvote', '/api/downvote'] },
  follow: { name: 'Follow', paths: ['/api/follow', '/api/unfollow', '/api/ignore'] },
  reblog: { name: 'Reblog', paths: ['/api/reblog'] },
  comment: { name: 'Comment', paths: ['/api/comment', '/api/deleteComment'] },
  post: { name: 'Post', paths: ['/api/post'] },
  escrow: { name: 'Escrow', paths: ['/api/escrowTransfer', '/api/escrowDispute', '/api/escrowRelease'] },
};
