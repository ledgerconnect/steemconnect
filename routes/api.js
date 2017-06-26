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
function verify(req, res) {
  const token = jwt.sign(
    {
      userId: req.userId,
      username: req.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1 day',
    }
  );

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
}
function vote({ voter, author, permlink, weight }, req, res) {
  weight = parseInt(weight, 10);
  steem.broadcast.vote(req.wif, voter, author, permlink, weight, (err, result) =>
    sendResponse({ err, result }, res)
  );
}
function comment(
  { parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata },
  req,
  res
) {
  steem.broadcast.comment(
    req.wif,
    parentAuthor,
    parentPermlink,
    author,
    permlink,
    title,
    body,
    jsonMetadata,
    (err, result) => sendResponse({ err, result }, res)
  );
}

function deleteComment({ author, permlink }, req, res) {
  steem.broadcast.comment(req.wif, author, permlink, (err, result) =>
    sendResponse({ err, result }, res)
  );
}
function reblog({ permlink, account, author }, req, res) {
  const requiredAuths = [];
  const requiredPostingAuths = [req.username];
  const id = 'follow';
  const json = JSON.stringify(['reblog', { account, author, permlink }]);
  steem.broadcast.customJson(
    req.wif,
    requiredAuths,
    requiredPostingAuths,
    id,
    json,
    (err, result) => sendResponse({ err, result }, res)
  );
}
function follow({ follower, following }, req, res) {
  const requiredAuths = [];
  const requiredPostingAuths = [req.username];
  const id = 'follow';
  const json = JSON.stringify(['follow', { follower, following, what: ['blog'] }]);
  steem.broadcast.customJson(
    req.wif,
    requiredAuths,
    requiredPostingAuths,
    id,
    json,
    (err, result) => sendResponse({ err, result }, res)
  );
}
function unfollow({ unfollower, unfollowing }, req, res) {
  const requiredAuths = [];
  const requiredPostingAuths = [req.username];
  const id = 'follow';
  const json = JSON.stringify([
    'follow',
    { follower: unfollower, following: unfollowing, what: [] },
  ]);
  steem.broadcast.customJson(
    req.wif,
    requiredAuths,
    requiredPostingAuths,
    id,
    json,
    (err, result) => sendResponse({ err, result }, res)
  );
}
function ignore({ follower, following }, req, res) {
  const requiredAuths = [];
  const requiredPostingAuths = [req.username];
  const id = 'follow';
  const json = JSON.stringify(['follow', { follower, following, what: ['ignore'] }]);
  steem.broadcast.customJson(
    req.wif,
    requiredAuths,
    requiredPostingAuths,
    id,
    json,
    (err, result) => sendResponse({ err, result }, res)
  );
}

function customJson({ id, json, requiredPostingAuths, requiredAuths }, req, res) {
  steem.broadcast.customJson(
    req.wif,
    requiredAuths,
    requiredPostingAuths,
    id,
    json,
    (err, result) => sendResponse({ err, result }, res)
  );
}

function claimRewardBalance({ account, rewardSteem, rewardSbd, rewardVests }, req, res) {
  if (req.username !== account) {
    sendResponse({ err: 'account name must match with steemconnect account name' }, res);
  } else {
    steem.broadcast.claimRewardBalance(
      req.wif,
      account,
      rewardSteem,
      rewardSbd,
      rewardVests,
      (err, result) => sendResponse({ err, result }, res)
    );
  }
}

router.get('/api/authorize', (req, res) => {
  res.redirect(302, `/authorize?${querystring.stringify(req.query)}`);
});

router.get('/api/verifyToken', (req, res) => {
  const { token } = req.query;
  jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
    const username = result && result.username ? result.username : undefined;
    const userId = result && result.userId ? result.userId : undefined;
    res.json({
      isValid: !err,
      userId,
      username,
    });
  });
});

router.use('/api', verifyAuth);
router.use('/api/@:appUserName', checkOrigin, checkPermission, apiRouter);

apiRouter.get('/verify', verify);
apiRouter.get('/vote', (req, res) => vote(req.query, req, res));
apiRouter.get('/comment', (req, res) => comment(req.query, req, res));
apiRouter.get('/deleteComment', (req, res) => deleteComment(req.query, req, res));
apiRouter.get('/reblog', (req, res) => reblog(req.query, req, res));
apiRouter.get('/follow', (req, res) => follow(req.query, req, res));
apiRouter.get('/unfollow', (req, res) => unfollow(req.query, req, res));
apiRouter.get('/ignore', (req, res) => ignore(req.query, req, res));
apiRouter.get('/customJson', (req, res) => customJson(req.query, req, res));
apiRouter.get('/claimRewardBalance', (req, res) => claimRewardBalance(req.query, req, res));

apiRouter.post('/verify', verify);
apiRouter.post('/vote', (req, res) => vote(req.body, req, res));
apiRouter.post('/comment', (req, res) => comment(req.body, req, res));
apiRouter.post('/deleteComment', (req, res) => deleteComment(req.body, req, res));
apiRouter.post('/reblog', (req, res) => reblog(req.body, req, res));
apiRouter.post('/follow', (req, res) => follow(req.body, req, res));
apiRouter.post('/unfollow', (req, res) => unfollow(req.body, req, res));
apiRouter.post('/ignore', (req, res) => ignore(req.body, req, res));
apiRouter.post('/customJson', (req, res) => customJson(req.body, req, res));
apiRouter.post('/claimRewardBalance', (req, res) => claimRewardBalance(req.body, req, res));

module.exports = router;
