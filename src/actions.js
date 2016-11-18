import * as authTypes from './auth/authAction';

const steemAuth = require('steemauth');
const steem = require('steem');
const cookie = require('../lib/cookie');

export function updateProfile(username) {
  return (dispatch) => {
    steem.api.getAccounts([username], (err, result) => {
      if (!result || !result[0]) {
        throw new Error('user not found');
      }
      const { memo_key, reputation, balance, name, sbd_balance } = result[0];
      let { json_metadata } = result[0];
      json_metadata = json_metadata.length ? JSON.parse(json_metadata) : {};
      dispatch({
        type: authTypes.LOGIN_SUCCESS,
        user: { name, json_metadata, memo_key, reputation, balance, sbd_balance },
      });
    });
  };
}

export function login() {
  return (dispatch) => {
    const auth = cookie.get('auth');
    if (!auth) {
      dispatch({ type: authTypes.LOGIN_NO_COOKIE });
      return;
    }
    dispatch({ type: authTypes.LOGIN_REQUEST });
    fetch('/api/verify', {
      credentials: 'include',
    }).then(response => response.json())
      .then(({ isAuthenticated, username }) => {
        if (!isAuthenticated) {
          throw new Error('Not authenticated');
        }
        return dispatch(updateProfile(username));
      })
      .catch((err) => {
        const errorMessage = typeof err !== 'string' ? ((err.data && err.data.error) || err.statusText) : err;
        dispatch({
          type: authTypes.LOGIN_FAILURE,
          user: {},
          errorMessage,
        });
      });
  };
}

export function accountUpdate(username, passwordOrWif, memo_key, jsonMetadata) {
  return (dispatch) => {
    dispatch({
      type: authTypes.UPDATE_PROFILE,
      user: { isUpdatingProfile: true, isUpdatingProfileError: undefined },
    });
    const isWif = steemAuth.isWif(passwordOrWif);
    const ownerKey = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'owner');
    return new Promise((resolve, reject) => {
      steem.broadcast.accountUpdate(ownerKey, username, undefined, undefined, undefined,
        memo_key, jsonMetadata, (err) => {
          if (err) {
            console.error('Error while processing accountUpdate', JSON.stringify(err));
            reject(dispatch({
              type: authTypes.UPDATE_PROFILE,
              user: {
                isUpdatingProfile: false,
                isUpdatingProfileError: err,
              },
            }));
          }
          resolve(dispatch({
            type: authTypes.UPDATE_PROFILE,
            user: {
              isUpdatingProfile: false,
              isUpdatingProfileError: !!err,
            },
          }));
        });
    });
  };
}

export function setAvatar(passwordOrWif, file, type) {
  return (dispatch, getState) => {
    const state = getState();
    const user = state.auth.user;
    user.json_metadata = user.json_metadata || {};
    user.json_metadata.profile = user.json_metadata.profile || {};
    const profileData = user.json_metadata.profile;
    const body = new FormData();
    body.append('file', file);
    let uploadUrl = `https://img.steemconnect.com/@${user.name}`;
    if (type === 'cover_image') {
      uploadUrl += '/cover';
    }
    fetch(uploadUrl, { method: 'POST', body, origin: true })
      .then(response => response.json())
      .then(({ url }) => {
        profileData[type] = url || uploadUrl;
        dispatch(accountUpdate(user.name, passwordOrWif, user.memo_key, user.json_metadata));
      }).catch((err) => {
        console.error('Error While Setting Avatar', err);
      });
  };
}

export function getAccountHistory(username, from, limit) {
  return (dispatch) => {
    steem.api.getAccountHistory(username, from, limit, (err, result) => {
      if (err) {
        console.error(err);
      }
      dispatch({
        type: authTypes.UPDATE_PROFILE,
        user: { accountHistory: result },
      });
    });
  };
}

export function clearUpdatingResult() {
  return {
    type: authTypes.UPDATE_PROFILE,
    user: { isUpdatingProfile: undefined, isUpdatingProfileError: undefined },
  };
}

export function logout() {
  cookie.remove('auth');
  window.location = '/';

  return { type: authTypes.LOGOUT_SUCCESS };
}
