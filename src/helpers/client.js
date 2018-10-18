import { Client } from 'dsteem';
import * as steemuri from 'steem-uri';
import urlParse from 'url-parse';
import qs from 'query-string';
import snakeCase from 'lodash/snakeCase';
import opsMap from './operations.json';

const CLIENT_OPTIONS = { timeout: 15000 };

let rawClient = new Client('https://api.steemit.com', CLIENT_OPTIONS);

const handler = {
  get(target, prop) {
    if (prop === 'updateClient') {
      return address => {
        rawClient = new Client(address, CLIENT_OPTIONS);
      };
    }

    return rawClient[prop];
  },
};

const client = new Proxy({}, handler);

export async function resolveTransaction(parsed, signer) {
  const props = await client.database.getDynamicGlobalProperties();

  // resolve the decoded tx and params to a signable tx
  const { tx } = steemuri.resolveTransaction(parsed.tx, parsed.params, {
    /* eslint-disable no-bitwise */
    ref_block_num: props.head_block_number & 0xffff,
    ref_block_prefix: Buffer.from(props.head_block_id, 'hex').readUInt32LE(4),
    expiration: new Date(Date.now() + client.broadcast.expireTime).toISOString().slice(0, -5),
    signers: [signer],
    preferred_signer: signer,
  });
  tx.ref_block_num = parseInt(tx.ref_block_num, 10);
  tx.ref_block_prefix = parseInt(tx.ref_block_prefix, 10);

  return tx;
}

export function legacyUriToParsedSteemUri(uri) {
  let parsed;
  try {
    const url = urlParse(uri);
    const opName = snakeCase(url.pathname.slice(1));
    const queryParams = qs.parse(url.query.slice(1));
    if (opsMap[opName]) {
      const opParams = opsMap[opName].template;
      /* eslint-disable no-return-assign */
      Object.keys(queryParams)
        .filter(key => key in opParams)
        .forEach(key => (opParams[key] = queryParams[key]));
      const params = { callback: queryParams.redirect_uri };
      const b64Uri = steemuri.encodeOps([[opName, opParams]], params);
      parsed = steemuri.decode(b64Uri);
    }
  } catch (err) {
    console.log('Failed to parse legacy uri', err);
  }
  return parsed;
}

export default client;
