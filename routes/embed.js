const express = require('express');
const steem = require('steem');

const router = new express.Router();

router.get('/vote', (req, res) => {
  const author = req.query.author || 'siol';
  const permlink = req.query.permlink || 'test-periscope';
  const weight = req.query.weight || 10000;

  steem.api.getContent(author, permlink, (err, result) => {
    res.render('embed/vote', {
      layout: 'embed',
      author,
      permlink,
      weight,
      content: result,
      json: JSON.stringify(result),
    });
  });
});

module.exports = router;
