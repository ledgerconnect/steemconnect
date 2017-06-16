import steem from 'steem';
import fetch from 'isomorphic-fetch';
import { decode } from 'steem/lib/auth/memo';
import { key_utils } from 'steem/lib/auth/ecc';

export const login = ({ username, wif, role = 'posting' }, cb) => {
  fetch(`/api/login/challenge?username=${username}&role=${role}`)
    .then(res => res.json())
    .then(data => {
      const token = decode(wif, data.code).substring(1);
      localStorage.setItem('token', token);
      cb(null, data);
    })
    .catch(err => cb(err, null));
};

export const hasAuthority = (user, clientId, role = 'posting') => {
  const auths = user[role].account_auths.map((auth) => auth[0]);
  return auths.indexOf(clientId) !== -1;
};

export const addPostingAuthority = ({ username, wif, clientId }, cb) => {
  steem.api.getAccounts([username], (err, result) => {
    const { posting, memo_key, json_metadata } = result[0];
    let postingNew = posting;
    if (!hasAuthority(result[0], clientId)) {
      postingNew.account_auths.push([clientId, parseInt(posting.weight_threshold)]);
      steem.broadcast.accountUpdate(
        wif,
        username,
        undefined,
        undefined,
        postingNew,
        memo_key,
        json_metadata,
        (err, result) => cb(err, result));
    } else {
      cb(null, {});
    }
  });
};

export const authorize = ({ clientId, scope }, cb) => {
  const token = localStorage.getItem('token');
  fetch(`/api/oauth2/authorize?client_id=${clientId}&scope=${scope}`, {
    headers: new Headers({ Authorization: token })
  })
    .then(res => res.json())
    .then(data => cb(null, data))
    .catch(err => cb(err, null));
};

// https://github.com/steemit/condenser/blob/634c13cd0d2fafa28592e9d5f43589e201198248/app/components/elements/SuggestPassword.jsx#L97
export const createSuggestedPassword = () => {
  const PASSWORD_LENGTH = 32;
  const privateKey = key_utils.get_random_key();
  return privateKey.toWif().substring(3, 3 + PASSWORD_LENGTH);
};

export const getAccountCreationFee = async () => {
  const chainConfig = await steem.api.getConfig();
  const chainProps = await steem.api.getChainPropertiesAsync();
  const accountCreationFee = chainProps.account_creation_fee;
  const steemModifier = chainConfig.STEEMIT_CREATE_ACCOUNT_WITH_STEEM_MODIFIER;
  const accountCreationSteemFee = parseFloat(accountCreationFee.split(' ')[0]) * steemModifier;
  return accountCreationSteemFee.toFixed(3) + ' STEEM';
};
