const express = require('express');
const steem = require('steem');
const { verifyAuth, checkPermission } = require('./middleware');
const apiList = require('../lib/apiList');

const router = new express.Router();

function sendResponse({ err: error, result }, res) {
  if (error) {
    return res.status(500).send({ error });
  }
  return res.json({ result });
}

router.use('/api', verifyAuth, checkPermission);

router.get('/api/verify', (req, res) => {
  if (req.username) {
    return res.json({
      isAuthenticated: true,
      username: req.username,
      permissions: (req.token && req.token.permission),
    });
  }
  return res.json({
    isAuthenticated: false,
  });
});

router.get(apiList.vote.path, (req, res) => {
  const { voter, author, permlink } = req.query;
  const weight = parseInt(req.query.weight, 10);
  steem.broadcast.vote(req.wif, voter, author, permlink, weight, (err, result) => {
    return sendResponse({ err, result }, res);
  });
});

router.get(apiList.comment.path, (req, res) => {
  const { parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata } = req.query;
  steem.broadcast.comment(req.wif,
    parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata,
    (err, result) => {
      return sendResponse({ err, result }, res);
    });
});

router.get('/api/accountCreate', (req, res) => {
  const { fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata } = req.query;
  steem.broadcast.accountCreate(req.wif,
    fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata,
    (err, result) => {
      return sendResponse({ err, result }, res);
    });
});

router.get('/api/customJson', (req, res) => {
  const { id, json, requiredPostingAuths, requiredAuths } = req.query;
  steem.broadcast.customJson(req.wif, requiredAuths, requiredPostingAuths, id, json,
    (err, result) => {
      return sendResponse({ err, result }, res);
    });
});

module.exports = router;
