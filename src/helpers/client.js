import Client from 'lightrpc';

const client = new Client('https://api.steemit.com', { timeout: 15000 });

client.callAsync = (message, params) => (
  new Promise((resolve, reject) => {
    client.call(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  })
);

export default client;
