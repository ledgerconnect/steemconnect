const express = require('express');
const debug = require('debug')('sc2:server');
const { authenticate, verifyPermissions } = require('../helpers/middleware');
const { encode } = require('steem/lib/auth/memo');
const { issueUserToken } = require('../helpers/token');
const config = require('../config.json');
const router = express.Router();

/** Get my account details */
router.all('/me', authenticate(), async (req, res, next) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  const accounts = await req.steem.api.getAccountsAsync([req.user]);
  res.json({
    user: req.user,
    account: accounts[0],
    scope,
  });
});

/** Get applications */
router.get('/apps', async (req, res, next) => {
  const apps = await req.db.apps.findAll({ attributes: { exclude: ['secret'] } });
  res.json(apps);
});

/** Get my applications */
router.all('/apps/me', authenticate('user'), async (req, res, next) => {
  const apps = await req.db.apps.findAll({ where: { owner: req.user } });
  res.json(apps);
});

/** Get application details */
router.get('/apps/@:clientId', async (req, res, next) => {
  const { clientId } = req.params;
  const app = await req.db.apps.findOne({ where: { client_id: clientId } });
  if (!app) return next();
  if (!req.user || app.owner !== req.user) {
    app.secret = undefined;
  }
  res.json(app);
});

/** Update application */
router.put('/apps/@:clientId', authenticate('user'), async (req, res, next) => {
  const { clientId } = req.params;
  const app = req.body;
  try {
    await req.db.apps.update({
      redirect_uris: app.redirect_uris,
      name: app.name,
      description: app.description,
      icon: app.icon,
      website: app.website,
    }, {
      where: {
        client_id: clientId,
        owner: req.user,
      }
    });
  } catch (err) {
    return next(err);
  }
  res.json({ success: true });
});

/** Broadcast transactions */
router.post('/broadcast', authenticate('app'), verifyPermissions, async (req, res, next) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  const { operations } = req.body;
  let isAuthorized = true;

  operations.forEach((operation) => {
    /** Check if operation is allowed */
    if (scope.indexOf(operation[0]) === -1) {
      isAuthorized = false;
    }
    /** Check if author of the operation is user */
    if (
      operation[1].voter !== req.user &&
      operation[1].author !== req.user &&
      (operation[1].required_posting_auths.length && operation[1].required_posting_auths[0] !== req.user)
    ) {
      isAuthorized = false;
    }
  });

  if (!isAuthorized) {
    res.status(401).send('Unauthorized!');
  } else {
    debug(`Broadcast transaction for @${req.user} from app @${req.proxy}`);
    req.steem.broadcast.send(
      { operations, extensions: [] },
      { posting: process.env.BROADCASTER_POSTING_WIF },
      (err, result) => {
        console.log(err, result);
        res.json({ errors: err, result });
      }
    );
  }
});

router.all('/login/challenge', async (req, res, next) => {
  const username = req.query.username;
  const role = req.query.role || 'posting';
  const token = issueUserToken(username);
  const accounts = await req.steem.api.getAccountsAsync([username]);
  const publicWif = accounts[0][role].key_auths[0][0];
  const code = encode(process.env.BROADCASTER_POSTING_WIF, publicWif, `#${token}`);
  res.json({
    username,
    code,
  });
});

module.exports = router;
