const express = require('express');
const steem = require('steem');
const { verifyAuth } = require('./middleware');

const router = new express.Router();

function sendResponse({ err: error, result }, res) {
  if (error) {
    res.status(500).send({ error });
  } else {
    res.json({ result });
  }
}

router.use('/api', verifyAuth);

router.get('/api/getAccount', (req, res) => {
  steem.api.getAccounts([req.username], (err, result) => {
    sendResponse({ err, result }, res);
  });
});

router.get('/api/verify', (req, res) => {
  if (req.username) {
    res.json({
      isAuthenticated: true,
      username: req.username,
      permissions: req.scope || ['verify', 'vote'],
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
});

router.get('/api/vote', (req, res) => {
  const { voter, author, permlink } = req.query;
  const weight = parseInt(req.query.weight, 10);
  steem.broadcast.vote(req.wif, voter, author, permlink, weight, (err, result) => {
    sendResponse({ err, result }, res);
  });
});

router.get('/api/comment', (req, res) => {
  const { parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata } = req.query;
  steem.broadcast.comment(req.wif,
    parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata,
    (err, result) => {
      sendResponse({ err, result }, res);
    });
});

router.get('/api/accountCreate', (req, res) => {
  const { fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata } = req.query;
  steem.broadcast.accountCreate(req.wif,
    fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata,
    (err, result) => {
      sendResponse({ err, result }, res);
    });
});

router.get('/api/customJson', (req, res) => {
  const { id, json, requiredPostingAuths, requiredAuths } = req.query;
  steem.broadcast.customJson(req.wif, requiredAuths, requiredPostingAuths, id, json,
    (err, result) => {
      sendResponse({ err, result }, res);
    });
});

module.exports = router;
