module.exports = {
  vote: { name: 'Vote', paths: ['/vote', '/upvote', '/downvote'] },
  follow: { name: 'Follow', paths: ['/follow', '/unfollow', '/ignore'] },
  reblog: { name: 'Reblog', paths: ['/reblog'] },
  comment: { name: 'Comment', paths: ['/comment', '/deleteComment'] },
  post: { name: 'Post', paths: ['/post'] },
  escrow: { name: 'Escrow', paths: ['/escrowTransfer', '/escrowDispute', '/escrowRelease'] },
};
