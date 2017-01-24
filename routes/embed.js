const express = require('express');

const router = new express.Router();

router.get('/vote', (req, res) => {
  const author = req.query.author;
  const permlink = req.query.permlink;
  const weight = req.query.weight || 10000;
  const domain = getDomain(req);
  const referer = req.get('Referer') || domain;
  res.render('embed/vote', {
    layout: 'embed',
    author,
    permlink,
    weight,
    referer,
    domain,
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
