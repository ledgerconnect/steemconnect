const express = require('express');
const steem = require('steem');
const jwt = require('jsonwebtoken');

const router = new express.Router();

router.get('/vote', (req, res) => {
  const author = req.query.author;
  const permlink = req.query.permlink;
  const weight = req.query.weight || 10000;
  const domain = getDomain(req);
  const referer = req.get('Referer') || domain;
  let { isAuth, hasVote } = false;
  let username;

  steem.api.getContent(author, permlink, (err, content) => {
    if (req.cookies.auth) {
      const data = jwt.verify(req.cookies.auth, process.env.JWT_SECRET);
      isAuth = true;
      username = data.username;
      if (content.active_votes) {
        content.active_votes.forEach((activeVote) => {
          if (activeVote.voter === username
            && activeVote.percent > 0) {
            hasVote = true;
          }
        });
      }
    }

    res.render('embed/vote', {
      layout: 'embed',
      author,
      permlink,
      weight,
      referer,
      content,
      isAuth,
      hasVote,
      username,
      domain,
    });
  });
});

const getDomain = (req) => {
  const host = req.headers.host;
  let domain = 'https://steemconnect.com';
  domain = (host === 'localhost:3000') ? 'http://localhost:3000' : domain;
  domain = (host === 'dev.steemconnect.com') ? 'https://dev.steemconnect.com' : domain;
  return domain;
};

module.exports = router;
