const express = require('express');
const { authenticateApp, verifyPermissions } = require('../helpers/middleware');
const router = express.Router();

/** Get user account details */
router.all('/me', authenticateApp, verifyPermissions, async (req, res, next) => {
  const accounts = await res.steem.api.getAccountsAsync([req.user]);
  res.json(accounts[0]);
});

/** Broadcast transactions */
router.post('/broadcast', authenticateApp, verifyPermissions, async (req, res, next) => {
  const allowedOperations = ['comment', 'comment_options', 'vote']; // custom_json
  const { operations } = req.body;
  let isAuthorized = true;

  operations.forEach((operation) => {
    /** Check if operation is allowed */
    if (allowedOperations.indexOf(operation[0]) === -1) {
      isAuthorized = false;
    }
    /** Check if author of the operation is user */
    if (operation[1].voter !== req.user && operation[1].author !== req.user) {
      isAuthorized = false;
    }
  });

  if (!isAuthorized) {
    res.status(401).send('Unauthorized!');
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
