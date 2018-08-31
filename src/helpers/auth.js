import { PrivateKey } from 'dsteem';
import * as bs58 from 'bs58';
import client from './client';

function decodePrivate(encodedKey) {
  const buffer = bs58.decode(encodedKey);

  if (buffer[0] !== 128) throw new Error('private key network id mismatch');

  return buffer.slice(0, -4);
}

export function privateKeyFrom(password) {
  return new PrivateKey(decodePrivate(password).slice(1));
}

function getActivePublicKey(username, password) {
  let privateKey = null;

  try {
    privateKey = privateKeyFrom(password);
  } catch (err) {
    privateKey = PrivateKey.fromSeed(`${username}active${password}`);
  }

  return privateKey.createPublic().toString();
}

async function getUserKeys(username, type) {
  let accounts = [];

  try {
    accounts = await client.database.getAccounts([username]);
  } catch (err) {
    console.error(err);
  }

  if (accounts.length === 1) {
    if (type === 'memo') {
      return [accounts[0].memo_key];
    }

    return accounts[0][type].key_auths.map(key => key[0]);
  }

  return [];
}

export async function credentialsValid(username, password) {
  const publicKey = getActivePublicKey(username, password);

  const matchingKeys = await getUserKeys(username, 'active');

  return matchingKeys.indexOf(publicKey) !== -1;
}

export async function memoValid(username, memo) {
  const matchingKeys = await getUserKeys(username, 'memo');

  return matchingKeys.indexOf(memo) !== -1;
}

export async function getKeys(username, password) {
  const keys = {
    active: null,
    memo: null,
  };

  try {
    const activeKey = privateKeyFrom(password);

    keys.active = activeKey.toString();
  } catch (err) {
    const activeKey = PrivateKey.fromSeed(`${username}active${password}`);
    const memoKey = PrivateKey.fromSeed(`${username}memo${password}`);

    keys.active = activeKey.toString();

    const isMemoValid = await memoValid(username, memoKey.createPublic().toString());

    if (isMemoValid) {
      keys.memo = memoKey.toString();
    }
  }

  return keys;
}
