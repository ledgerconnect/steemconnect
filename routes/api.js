const express = require('express');
const debug = require('debug')('sc2:server');
const { authenticate, verifyPermissions } = require('../helpers/middleware');
const { encode } = require('steem/lib/auth/memo');
const { issueUserToken } = require('../helpers/token');
const { getUserMetadata, updateUserMetadata } = require('../helpers/metadata');
const { getErrorMessage } = require('../helpers/operation');
const config = require('../config.json');
const router = express.Router();

/** Get my account details */
router.post('/me', authenticate(), async (req, res, next) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  const accounts = await req.steem.api.getAccountsAsync([req.user]);
  const user_metadata = req.role === 'app'
    ? await getUserMetadata(req.proxy, req.user)
    : undefined;
  res.json({
    user: req.user,
    account: accounts[0],
    scope,
    user_metadata,
  });
});

/** Update user_metadata */
router.put('/me', authenticate('app'), async (req, res, next) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  const accounts = await req.steem.api.getAccountsAsync([req.user]);
  const { user_metadata } = req.body;

  if (typeof user_metadata === 'object') {
    /** Check object size */
    const bytes = Buffer.byteLength(JSON.stringify(user_metadata), 'utf8');
    if (bytes <= config.user_metadata.max_size) {

      /** Save user_metadata object on database */
      debug(`Store object for ${req.user} (size ${bytes} bytes)`);
      await updateUserMetadata(req.proxy, req.user, user_metadata);

      res.json({
        user: req.user,
        account: accounts[0],
        scope,
        user_metadata,
      });
    } else {
      return res.status(413).json({
        error: 'invalid_request',
        error_description: `User metadata object must not exceed ${config.user_metadata.max_size / 1000000} MB`,
      });
    }
  } else {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'User metadata must be an object',
    });
  }
});

/** Broadcast transaction */
router.post('/broadcast', authenticate('app'), verifyPermissions, async (req, res, next) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  const { operations } = req.body;

  let scopeIsValid = true;
  let requestIsValid = true;
  operations.forEach((operation) => {
    /** Check if operation is allowed */
    if (scope.indexOf(operation[0]) === -1) {
      scopeIsValid = false;
    }
    /** Check if author of the operation is user */
    if (
      (operation[0] === 'vote' && operation[1].voter !== req.user)
      || (operation[0] === 'comment' && operation[1].author !== req.user)
      || (operation[0] === 'custom_json' && operation[1].required_posting_auths[0] && operation[1].required_posting_auths[0] !== req.user)
    ) {
      requestIsValid = false;
    }
  });

  if (!scopeIsValid) {
    return res.status(401).json({
      error: 'invalid_scope',
      error_description: `The operation ${operation[0]} is not allowed by the access_token scope`,
    });
  } else if (!requestIsValid) {
    return res.status(401).json({
      error: 'unauthorized_client',
      error_description: `This access_token allow you to broadcast transaction only for the account @${req.user}`,
    });
  } else {
    debug(`Broadcast transaction for @${req.user} from app @${req.proxy}`);
    req.steem.broadcast.send(
      { operations, extensions: [] },
      { posting: process.env.BROADCASTER_POSTING_WIF },
      (err, result) => {

        /** Save in database the operations broadcasted */
        if (!err) {
          const opsArray = operations.map((operation) => {
            return {
              client_id: req.proxy,
              user: req.user,
              token: req.token,
              operation_type: operation[0],
              operation_payload: operation[1],
              tx_id: result.id,
            };
          });

          req.db.operations.bulkCreate(opsArray).catch((err) => {
            debug('Operations failed to be stored on database', err);
          });

          res.json({ result });
        } else {
          debug('Transaction broadcast failed', operations, err);
          return res.status(500).json({
            error: 'server_error',
            error_description: getErrorMessage(err) || err.message || err,
          });
        }
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
