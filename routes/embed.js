const express = require('express');
const steem = require('steem');

const router = new express.Router();

router.get('/vote', (req, res) => {
  const author = req.query.author || 'siol';
  const permlink = req.query.permlink || 'test-periscope';
  steem.api.getContent(author, permlink, (err, result) => {
    res.render('embed/vote', {
      layout: 'embed',
      author,
      permlink,
      content: result,
    });
  });
});

module.exports = router;
