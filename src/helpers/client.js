import { Client, PrivateKey } from 'dsteem';

const client = new Client('https://api.steemit.com', { timeout: 15000 });

export function cancelLimitOrder(owner, orderId, activeKey) {
  const op = [
    'limit_order_cancel',
    {
      owner,
      orderid: orderId,
    },
  ];

  return client.broadcast.sendOperations([op], PrivateKey.from(activeKey));
}

export default client;
