import steem from 'steem';
import fetch from 'isomorphic-fetch';
import { decode } from 'steem/lib/auth/memo';

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
    const { owner, active, posting, memo_key, json_metadata } = result[0];
    let postingNew = posting;
    if (!hasAuthority(result[0], clientId)) {
      postingNew.account_auths.push([clientId, parseInt(posting.weight_threshold)]);
      steem.broadcast.accountUpdate(
        wif,
        username,
        owner,
        active,
        postingNew,
        memo_key,
        json_metadata,
        (err, result) => cb(err, result));
    } else {
      cb(null, {});
    }
  });
};

export const authorize = ({ clientId }, cb) => {
  const token = localStorage.getItem('token');
  fetch(`/api/oauth2/authorize?client_id=${clientId}`, {
    headers: new Headers({ Authorization: token })
  })
    .then(res => res.json())
    .then(data => cb(null, data))
    .catch(err => cb(err, null));
};
