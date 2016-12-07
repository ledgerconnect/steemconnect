const express = require('express');
const steem = require('steem');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const { verifyAuth, checkOrigin, checkPermission } = require('./middleware');

const router = new express.Router();
const apiRouter = new express.Router();

function sendResponse({ err: error, result }, res) {
  if (error) {
    return res.status(500).send({ error });
  }
  return res.json({ result });
}

router.get('/api/authorize', (req, res) => {
  res.redirect(302, `/authorize?${querystring.stringify(req.query)}`);
});

router.get('/api/verifyToken', (req, res) => {
  const { token } = req.query;
  jwt.verify(token, process.env.JWT_SECRET, {}, err =>
    res.json({
      isValid: (!err),
    })
  );
});

router.use('/api', verifyAuth);

// For steemconnect
router.get('/api/verify', ({ username }, res) => res.json({ isAuthenticated: !!username, username }));

router.use('/api/@:appUserName', checkOrigin, checkPermission, apiRouter);

apiRouter.get('/verify', (req, res) => {
  const token = jwt.sign({
    username: req.username,
  }, process.env.JWT_SECRET, {
    expiresIn: '1 day',
  });
  if (req.username) {
    return res.json({
      isAuthenticated: true,
      username: req.username,
      permissions: req.permissions,
      token,
    });
  }
  return res.json({
    isAuthenticated: false,
  });
});

apiRouter.get('/vote', (req, res) => {
  const { voter, author, permlink } = req.query;
  const weight = parseInt(req.query.weight, 10);
  steem.broadcast.vote(req.wif, voter, author, permlink, weight,
    (err, result) => sendResponse({ err, result }, res));
});

apiRouter.get('/comment', (req, res) => {
  const { parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata } = req.query;
  steem.broadcast.comment(req.wif, parentAuthor, parentPermlink,
    author, permlink, title, body, jsonMetadata,
    (err, result) => sendResponse({ err, result }, res));
});

apiRouter.get('/deleteComment', (req, res) => {
  const { author, permlink } = req.query;
  steem.broadcast.comment(req.wif, author, permlink,
    (err, result) => sendResponse({ err, result }, res));
});

apiRouter.get('/reblog', (req, res) => {
  const { permlink, account, author } = req.query;
  const requiredAuths = [];
  const requiredPostingAuths = [req.username];
  const id = 'follow';
  const json = JSON.stringify(['reblog', { account, author, permlink }]);
  steem.broadcast.customJson(req.wif, requiredAuths, requiredPostingAuths, id, json,
    (err, result) => sendResponse({ err, result }, res));
});

apiRouter.get('/follow', (req, res) => {
  const { follower, following } = req.query;
  const requiredAuths = [];
  const requiredPostingAuths = [req.username];
  const id = 'follow';
  const json = JSON.stringify(['follow', { follower, following, what: ['blog'] }]);
  steem.broadcast.customJson(req.wif, requiredAuths, requiredPostingAuths, id, json,
    (err, result) => sendResponse({ err, result }, res));
});

apiRouter.get('/unfollow', (req, res) => {
  const { unfollower, unfollowing } = req.query;
  const requiredAuths = [];
  const requiredPostingAuths = [req.username];
  const id = 'follow';
  const json = JSON.stringify(['follow', { follower: unfollower, following: unfollowing, what: [] }]);
  steem.broadcast.customJson(req.wif, requiredAuths, requiredPostingAuths, id, json,
    (err, result) => sendResponse({ err, result }, res));
});

apiRouter.get('/ignore', (req, res) => {
  const { follower, following } = req.query;
  const requiredAuths = [];
  const requiredPostingAuths = [req.username];
  const id = 'follow';
  const json = JSON.stringify(['follow', { follower, following, what: ['ignore'] }]);
  steem.broadcast.customJson(req.wif, requiredAuths, requiredPostingAuths, id, json,
    (err, result) => sendResponse({ err, result }, res));
});

apiRouter.get('/escrowTransfer', (req, res) => {
  const { from, to, amount, memo, escrow_id: escrowId, agent, fee,
    json_meta: jsonMeta, expiration } = req.query;
  steem.broadcast.escrowTransfer(req.wif, from, to, amount,
    memo, escrowId, agent, fee, jsonMeta, expiration,
    (err, result) => sendResponse({ err, result }, res));
});

apiRouter.get('/escrowDispute', (req, res) => {
  const { from, to, escrow_id: escrowId, who } = req.query;
  steem.broadcast.escrowDispute(req.wif, from, to, escrowId, who,
    (err, result) => sendResponse({ err, result }, res));
});
apiRouter.get('/escrowRelease', (req, res) => {
  const { from, to, escrow_id: escrowId, who, amount } = req.query;
  steem.broadcast.escrowRelease(req.wif, from, to, escrowId, who, amount,
    (err, result) => sendResponse({ err, result }, res));
});


apiRouter.get('/accountCreate', (req, res) => {
  const { fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata } = req.query;
  steem.broadcast.accountCreate(req.wif, fee, creator, newAccountName,
    owner, active, posting, memoKey, jsonMetadata,
    (err, result) => sendResponse({ err, result }, res));
});

apiRouter.get('/customJson', (req, res) => {
  const { id, json, requiredPostingAuths, requiredAuths } = req.query;
  steem.broadcast.customJson(req.wif, requiredAuths, requiredPostingAuths, id, json,
    (err, result) => sendResponse({ err, result }, res));
});

module.exports = router;
