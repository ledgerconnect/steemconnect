const express = require('express');
const router = express.Router();

router.get('/test', (req, res, next) => {
  const operations = [['vote', {
    voter: 'guest123',
    author: 'krnel',
    permlink: 'getting-too-personal-with-ai-assistants',
    weight: 10000,
  }]];

  res.steem.broadcast.send(
    { operations, extensions: [] },
    { posting: process.env.BROADCASTER_POSTING_WIF },
    (err, result) => {
      console.log(err, result);
      res.json({ errors: err, result });
    }
  );
});

router.post('/rpc', (req, res, next) => {
  const { operations } = req.body;
  const allowedOperations = ['comment', 'comment_options', 'vote']; // custom_json
  const errors = [];

  /** Check if operations are allowed */
  operations.forEach((operation) => {
    if (allowedOperations.indexOf(operation[0]) === -1) {
      errors.push(`Operation '${operation[0]}' is not allowed.`);
    }
    /** Restrict the use to guest123 account */
    if (operation[1].voter !== 'guest123' && operation[1].author !== 'guest123') {
      errors.push(`You are not allowed to perform operation for '${operation[1].voter || operation[0].author}'`);
    }
  });

  if (errors.length > 0) {
    res.json({ errors });
  } else {
    res.steem.broadcast.send(
      { operations, extensions: [] },
      { posting: process.env.BROADCASTER_POSTING_WIF },
      (err, result) => {
        console.log(err, result);
        res.json({ errors: err, result });
      }
    );
  }
});

module.exports = router;
