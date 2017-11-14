import isEmpty from 'lodash/isEmpty';
import ls from 'local-storage';
import { Base64 } from 'js-base64';

export const hasAuth = () => {
  const keys = ls.get('_keys') || {};
  return !isEmpty(keys);
};

export const addAuth = (username, role, wif) => {
  const keys = ls.get('_keys') || {};
  keys[username] = {
    username,
    role,
    wif: Base64.encode(wif),
  };
  ls.set('_keys', keys);
};

export const getAuth = () => {
  let auth = false;
  if (hasAuth()) {
    const keys = ls.get('_keys');
    const lastKey = ls.get('_last');
    auth = keys[lastKey] || keys[Object.keys(keys)[0]];
    auth.wif = Base64.decode(auth.wif);
  }
  return auth;
};

export const setLastUsername = (username) => {
  ls.set('_last', username);
};

export const clear = () => {
  ls.clear();
};
