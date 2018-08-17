import { PrivateKey } from 'dsteem';
import client from './client';

function getActivePublicKey(username, password) {
  let privateKey = null;

  try {
    privateKey = PrivateKey.from(password);
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
    const activeKey = PrivateKey.from(password);

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
