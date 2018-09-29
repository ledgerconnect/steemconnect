import { Client } from 'dsteem';
import * as steemuri from 'steem-uri';
import { privateKeyFrom } from '@/helpers/auth';

const DEFAULT_EXPIRE = '2106-02-07T06:28:15';
const CLIENT_OPTIONS = { timeout: 15000 };

let rawClient = new Client('https://api.steemit.com', CLIENT_OPTIONS);

const handler = {
  get(target, prop) {
    if (prop === 'updateClient') {
      return (address) => {
        rawClient = new Client(address, CLIENT_OPTIONS);
      };
    }

    return rawClient[prop];
  },
};

const client = new Proxy({}, handler);

export function unfollow(self, username, postingKey) {
  const op = [
    'custom_json',
    {
      id: 'follow',
      required_auths: [],
      required_posting_auths: [self],
      json: JSON.stringify([
        'follow',
        {
          follower: self,
          following: username,
          what: [],
        },
      ]),
    },
  ];

  return client.broadcast.sendOperations([op], privateKeyFrom(postingKey));
}

export function createLimitOrder(
  owner,
  amountToSell,
  minToReceive,
  fillOrKill = false,
  expiration = DEFAULT_EXPIRE,
  activeKey,
) {
  const op = [
    'limit_order_create',
    {
      owner,
      orderid: Math.floor(Date.now() / 1000),
      amount_to_sell: amountToSell.toString(),
      min_to_receive: minToReceive.toString(),
      fill_or_kill: fillOrKill,
      expiration,
    },
  ];

  return client.broadcast.sendOperations([op], privateKeyFrom(activeKey));
}

export function cancelLimitOrder(owner, orderId, activeKey) {
  const op = [
    'limit_order_cancel',
    {
      owner,
      orderid: orderId,
    },
  ];

  return client.broadcast.sendOperations([op], privateKeyFrom(activeKey));
}

export async function resolveTransaction(parsed, signer) {
  const props = await client.database.getDynamicGlobalProperties();

  // resolve the decoded tx and params to a signable tx
  const { tx } = steemuri.resolveTransaction(parsed.tx, parsed.params, {
    /* eslint-disable no-bitwise */
    ref_block_num: props.head_block_number & 0xFFFF,
    ref_block_prefix: Buffer.from(props.head_block_id, 'hex').readUInt32LE(4),
    expiration: new Date(Date.now() + client.broadcast.expireTime).toISOString().slice(0, -5),
    signers: [signer],
    preferred_signer: signer,
  });
  tx.ref_block_num = parseInt(tx.ref_block_num, 10);
  tx.ref_block_prefix = parseInt(tx.ref_block_prefix, 10);

  return tx;
}

export default client;
