const Client = require('lightrpc');

const client = new Client('https://api.steemit.com');

client.call('get_order_book', [500], (err, result) => {
  if (err !== null) console.error(err);
  console.log('get_order_book', result);
});

client.call('get_recent_trades', [25], (err, result) => {
  if (err !== null) console.error(err);
  console.log('get_recent_trades', result);
});

client.call('get_ticker', [], (err, result) => {
  if (err !== null) console.error(err);
  console.log('get_ticker', result);
});

client.call('get_trade_history', ['2018-07-16T18:58:55', '1969-12-31T23:59:59', 1000], (err, result) => {
  if (err !== null) console.error(err);
  console.log('get_trade_history', result);
});
