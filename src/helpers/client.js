import { Client } from 'dsteem';

const client = new Client('https://api.steemit.com', { timeout: 15000 });

export default client;
