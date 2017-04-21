const express = require('express');
const steem = require('steem');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const { verifyAuth, checkOrigin, checkPermission } = require('./middleware');

const router = new express.Router();
const apiRouter = new express.Router();

function sendResponse({ err: error, result }, res) {
  if (error) {
    return res.status(400).send({ error });
  }
  return res.json({ result });
}

router.get('/api/authorize', (req, res) => {
  res.redirect(302, `/authorize?${querystring.stringify(req.query)}`);
});

router.get('/api/verifyToken', (req, res) => {
  const { token } = req.query;
  jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
    const username = (result && result.username) ? result.username : undefined;
    const userId = (result && result.userId) ? result.userId : undefined;
    res.json({
      isValid: (!err),
      userId,
      username,
    });
  });
});

router.use('/api', verifyAuth);

router.use('/api/@:appUserName', checkOrigin, checkPermission, apiRouter);

apiRouter.get('/verify', (req, res) => {
  const token = jwt.sign({
    userId: req.userId,
    username: req.username,
  }, process.env.JWT_SECRET, {
    expiresIn: '1 day',
  });

  if (req.username && (req.permissions !== null || req.baseUrl === '/api/@steemconnect')) {
    return res.json({
      userId: req.userId,
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

apiRouter.get('/customJson', (req, res) => {
  const { id, json, requiredPostingAuths, requiredAuths } = req.query;
  steem.broadcast.customJson(req.wif, requiredAuths, requiredPostingAuths, id, json,
    (err, result) => sendResponse({ err, result }, res));
});

module.exports = router;
