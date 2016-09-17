var express = require('express'),
  router = express.Router(),
  steem = require('steem'),
  {verifyAuth} = require('./middleware');

router.use('/api', verifyAuth);

router.get('/api/getAccount', function (req, res, next) {
  steem.api.getAccounts([req.username], (err, result) => {
    res.send({ err, result })
  });
});

router.get('/api/verify', function (req, res, next) {
  if (req.username) {
    res.json({
      isAuthenticated: true,
      username: req.username,
      permissions: req.scope || ['verify', 'vote']
    });
  } else {
    res.json({
      isAuthenticated: false
    })
  }
});

router.get('/api/vote', function (req, res, next) {
  var voter = req.query.voter,
    author = req.query.author,
    permlink = req.query.permlink,
    weight = parseInt(req.query.weight);
  steem.broadcast.vote(req.wif, voter, author, permlink, weight, function (err, result) {
    res.json({
      error: err,
      result: result
    });
  });
});

router.get('/api/comment', function (req, res, next) {
  var parentAuthor = req.query.parentAuthor,
    parentPermlink = req.query.parentPermlink,
    author = req.query.author,
    permlink = req.query.permlink,
    title = req.query.title,
    body = req.query.body,
    jsonMetadata = req.query.jsonMetadata;
  steem.broadcast.comment(req.wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, result) {
    res.json({
      error: err,
      result: result
    });
  });
});

router.get('/api/accountCreate', function (req, res, next) {
  var fee = req.query.fee,
    creator = req.query.creator,
    newAccountName = req.query.newAccountName,
    owner = req.query.owner,
    active = req.query.active,
    posting = req.query.posting,
    memoKey = req.query.memoKey,
    jsonMetadata = req.query.jsonMetadata;
  steem.broadcast.accountCreate(req.wif, fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata, function (err, result) {
    res.json({
      error: err,
      result: result
    });
  });
});

router.get('/api/customJson', function (req, res, next) {
  var requiredAuths = req.query.requiredAuths,
    requiredPostingAuths = req.query.requiredPostingAuths,
    id = req.query.id,
    json = req.query.json;
  steem.broadcast.customJson(req.wif, requiredAuths, requiredPostingAuths, id, json, function (err, result) {
    res.json({
      error: err,
      result: result
    });
  });
});

module.exports = router;
