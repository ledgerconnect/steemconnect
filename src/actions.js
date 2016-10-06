import * as authTypes from './auth/authActionTypes';

const axios = require('axios');
const steemAuth = require('steemauth');
const steem = require('steem');
const cookie = require('./../lib/cookie');

export function login() {
  return (dispatch) => {
    const auth = cookie.get('auth');
    if (!auth) {
      return;
    }
    dispatch({ type: authTypes.LOGIN_REQUEST });
    axios.get('/api/getAccount').then(({ data: { err, result } }) => {
      if (err) {
        throw err;
      } else {
        const { memo_key, reputation, balance, name } = result[0];
        let { json_metadata } = result[0];
        json_metadata = json_metadata.length ? JSON.parse(json_metadata) : {}; //eslint-disable-line
        dispatch({
          type: authTypes.LOGIN_SUCCESS,
          user: { name, json_metadata, memo_key, reputation, balance },
        });
      }
    }).catch((err) => {
      dispatch({
        type: authTypes.LOGIN_FAILURE,
        user: {},
        errorMessage: err.statusText || JSON.stringify(err),
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
    steem.broadcast.accountUpdate(ownerKey, username, undefined, undefined, undefined,
      memo_key, jsonMetadata, (err) => {
        if (err) {
          console.error('Error while processing accountUpdate', JSON.stringify(err));
        }

        dispatch({
          type: authTypes.UPDATE_PROFILE,
          user: {
            profile: jsonMetadata.profile,
            isUpdatingProfile: false,
            isUpdatingProfileError: !!err,
          },
        });
      });
  };
}

export function setAvatar(passwordOrWif, file, type) {
  return (dispatch, getState) => {
    const state = getState();
    const user = state.auth.user;
    const profileData = user.profile;
    const data = new FormData();
    data.append('file', file);
    let uploadUrl = `https://img.busy6.com/@${user.name}`;
    if (type === 'cover_image') {
      uploadUrl += '/cover.sass';
    }
    axios.post(uploadUrl, data, { origin: true })
      .then((response) => {
        const { data: { url } } = response;
        profileData[type] = url || uploadUrl;

        dispatch(accountUpdate(user.name, passwordOrWif, user.memo_key, { profile: profileData }));
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

export function clearUpdatingProfileResult() {
  return {
    type: authTypes.UPDATE_PROFILE,
    user: { isUpdatingProfile: undefined, isUpdatingProfileError: undefined },
  };
}
