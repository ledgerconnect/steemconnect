const express = require('express');
const debug = require('debug')('sc2:server');
const crypto = require('crypto');
const _ = require('lodash');
const { authenticate } = require('../helpers/middleware');
const { sleep } = require('../helpers/utils');
const config = require('../config.json');
const router = express.Router();

/** Get applications */
router.get('/', async (req, res, next) => {
  const apps = await req.db.apps.findAll({ attributes: { exclude: ['secret'] } });
  res.json(apps);
});

/** Get my applications */
router.all('/me', authenticate('user'), async (req, res, next) => {
  const apps = await req.db.apps.findAll({ where: { owner: req.user } });
  res.json(apps);
});

/** Get application details */
router.get('/@:clientId', async (req, res, next) => {
  const { clientId } = req.params;
  const app = await req.db.apps.findOne({ where: { client_id: clientId } });
  if (!app) return next();
  if (!req.user || app.owner !== req.user) {
    app.secret = undefined;
  }
  res.json(app);
});

/** Create application */
router.post('/@:clientId', authenticate('user'), async (req, res, next) => {
  const { clientId } = req.params;

  /** Wait 5 seconds to insure the newly created account is available on the node */
  await sleep(5000);

  const accounts = await req.steem.api.getAccountsAsync([clientId]);
  if (!accounts[0]) {
    return res.status(400).json({ error: `Proxy account @${clientId} does not exist` });
  }
  const proxy = accounts[0];
  const proxyAuthStr = JSON.stringify({
    owner: proxy.owner,
    active: proxy.active,
    posting: proxy.posting,
    memo: proxy.memo_key,
  });
  const offlinePubKeys = config.offline_generated_public_keys;
  const requiredAuthStr = JSON.stringify({
    owner: { weight_threshold: 1, account_auths: [['steemconnect', 1]], key_auths: [[offlinePubKeys.owner, 1]] },
    active: { weight_threshold: 1, account_auths: [['steemconnect', 1]], key_auths: [[offlinePubKeys.active, 1]] },
    posting: { weight_threshold: 1, account_auths: [['steemconnect', 1]], key_auths: [[offlinePubKeys.posting, 1]] },
    memo: offlinePubKeys.memo,
  });

  let jsonMetadata;
  try { jsonMetadata = JSON.parse(proxy.json_metadata); } catch (e) { jsonMetadata = {}; }

  if (
    proxyAuthStr === requiredAuthStr
    && jsonMetadata.owner && jsonMetadata.owner === req.user
  ) {
    const secret = crypto.randomBytes(24).toString('hex');
    req.db.apps.create({
      client_id: clientId,
      secret,
      owner: req.user,
    }).then(() => {
      res.json({ success: true });
    }).catch((err) => {
      const error = _.has(err, 'original.detail')
        ? err.original.detail
        : err;
      res.status(400).json({ error });
    });
  } else {
    res.status(400).json({ error: `Proxy account @${clientId} is not valid` });
  }
});

/** Update application */
router.put('/@:clientId', authenticate('user'), async (req, res, next) => {
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

module.exports = router;
