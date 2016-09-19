import * as authTypes from './auth/authActionTypes';

const axios = require('axios');
const steemAuth = require('steemauth');
const steem = require('steem');
const cookie = require('./../lib/cookie');
const crypto = require('crypto-js');
const _ = require('lodash');

function encryptData(object) {
  const crfs = cookie.get('_csrf');
  if (typeof crfs !== 'string' || (typeof crfs === 'string' && crfs.length === 0)) {
    cookie.save(Date.now().toString(16), '_csrf', { secure: global.location.hostname !== 'localhost' });
  }
  return crypto.AES.encrypt(crypto.enc.Utf8.parse(object), cookie.get('_csrf')).toString();
}

function login(username, passwordOrWif) {
  return (dispatch) => {
    const isWif = steemAuth.isWif(passwordOrWif);
    const wif = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'posting');
    dispatch({ type: authTypes.LOGIN_REQUEST });
    axios.get('/auth/login', {
      params: { encryptedData: encryptData(JSON.stringify({ username, wif })) },
    }).then(({ data }) => {
      const { error, userAccount, auth } = data;
      if (error) {
        dispatch({
          type: authTypes.LOGIN_FAILURE,
          user: {},
          errorMessage: error,
        });
      } else if (userAccount && auth.length) {
        const {  memo_key, reputation, balance } = userAccount; //eslint-disable-line
        let { json_metadata } = userAccount;
        json_metadata = json_metadata.length ? JSON.parse(json_metadata) : {}; //eslint-disable-line
        dispatch({
          type: authTypes.LOGIN_SUCCESS,
          user: { name: username, profile: json_metadata.profile, memo_key, reputation, balance },
        });
        cookie.save(auth, 'auth');
      } else {
        dispatch({
          type: authTypes.LOGIN_FAILURE,
          user: {},
          errorMessage: 'Malformed request',
        });
      }
    });
  };
}

function getAccount() {
  return function (dispatch, getState) {
    const auth = cookie.get('auth');
    if (!auth)
      return;
    dispatch({ type: authTypes.LOGIN_REQUEST });
    axios.get('/api/getAccount').then(({ data: { err, result } }) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      } else {
        let { json_metadata, memo_key, reputation, balance, name } = result[0];
        json_metadata = json_metadata.length ? JSON.parse(json_metadata) : {};
        dispatch({
          type: authTypes.LOGIN_SUCCESS,
          user: { name, profile: json_metadata.profile, memo_key, reputation, balance },
        });
      }
    }).catch((err) => {
      dispatch({
        type: authTypes.LOGIN_FAILURE,
        user: {},
        errorMessage: JSON.stringify(err),
      });
    });
  };
}

function logout() {
  return function (dispatch, getState) {
    const state = getState();
    const user = state.auth.user;
    let lastUser = cookie.get('last_users');
    if (!_.isArray(lastUser))
      lastUser = [];

    if (user.name) {
      lastUser = [user.name].concat(lastUser);
      lastUser = _.uniq(lastUser);
    }
    cookie.clear();
    cookie.save(lastUser, 'last_users');
    dispatch({ type: authTypes.LOGOUT_SUCCESS });
  };
}

function setAvatar(passwordOrWif, file, type) {
  return function (dispatch, getState) {
    const state = getState();
    const user = state.auth.user;
    const profileData = user.profile;
    const data = new FormData();
    data.append('file', file);
    let uploadUrl = 'https://img.busy6.com/@' + user.name;
    if (type === 'cover_image')
      uploadUrl += '/cover.sass';
    axios.post(uploadUrl, data, { origin: true })
      .then((data) => {
        const { data: { url } } = data;
        profileData[type] = url ? url : uploadUrl;

        dispatch(accountUpdate(user.name, passwordOrWif, user.memo_key, { profile: profileData }));
      }).catch((err) => {
        console.error('Error While Setting Avatar', err);
      });
  };
}

function accountUpdate(username, passwordOrWif, memo_key, jsonMetadata) {
  return function (dispatch, getState) {
    dispatch({ type: authTypes.UPDATE_PROFILE, user: { isUpdatingProfile: true, isUpdatingProfileError: undefined } });
    const isWif = steemAuth.isWif(passwordOrWif);
    const ownerKey = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'owner');
    steem.broadcast.accountUpdate(ownerKey, username, undefined, undefined, undefined, memo_key, jsonMetadata, (err, result) => {
      err && console.error('Error while processing accountUpdate', JSON.stringify(err));
      dispatch({
        type: authTypes.UPDATE_PROFILE,
        user: { profile: jsonMetadata.profile, isUpdatingProfile: false, isUpdatingProfileError: err ? true : false },
      });
    });
  };
}

function getAccountHistory(username, from, limit) {
  return (dispatch, getState) => {
    steem.api.getAccountHistory(username, from, limit, (err, result) => {
      err && console.error(err);
      dispatch({
        type: authTypes.UPDATE_PROFILE,
        user: { accountHistory: result },
      });
    });
  };
}

function clearUpdatingProfileResult() {
  return {
    type: authTypes.UPDATE_PROFILE,
    user: { isUpdatingProfile: undefined, isUpdatingProfileError: undefined },
  };
}
module.exports = {
  login,
  logout,
  setAvatar,
  accountUpdate,
  clearUpdatingProfileResult,
  getAccount,
  getAccountHistory,
};
