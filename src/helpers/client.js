import { Client } from 'dsteem';
import { privateKeyFrom } from '@/helpers/auth';

const DEFAULT_EXPIRE = '2106-02-07T06:28:15';

const client = new Client('https://api.steemit.com', { timeout: 15000 });

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

export default client;
