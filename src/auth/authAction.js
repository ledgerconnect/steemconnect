import * as authTypes from './authActionTypes';

const axios = require('axios');
const steemAuth = require('steemauth');
const crypto = require('crypto-js');
const _ = require('lodash');
const cookie = require('../../lib/cookie');

function encryptData(object) {
  const crfs = cookie.get('_csrf');
  if (typeof crfs !== 'string' || (typeof crfs === 'string' && crfs.length === 0)) {
    cookie.save(Date.now().toString(16), '_csrf', { secure: global.location.hostname !== 'localhost' });
  }
  return crypto.AES.encrypt(crypto.enc.Utf8.parse(object), cookie.get('_csrf')).toString();
}

export function selectLoginWithUserName(selected) {
  return { type: authTypes.UPDATE_LAST_USER_LIST, lastUserList: { selected, show: false } };
}

export function ShowLastUserList() {
  return { type: authTypes.UPDATE_LAST_USER_LIST, lastUserList: { show: true } };
}

export function logout() {
  return (dispatch, getState) => {
    const state = getState();
    const user = state.auth.user;
    let lastUser = cookie.get('last_users');
    if (!_.isArray(lastUser)) {
      lastUser = [];
    }
    if (user.name) {
      lastUser = [user.name].concat(lastUser);
      lastUser = _.uniq(lastUser);
    }
    cookie.clear();
    cookie.save(lastUser, 'last_users');
    dispatch({ type: authTypes.LOGOUT_SUCCESS });
  };
}


export function login(username, passwordOrWif) {
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
          user: { name: username, json_metadata, memo_key, reputation, balance },
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

export function demoLogin() {
  return login('guest123', '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg');
}

export function setAppPermission(appName, permissions) {
  return { type: authTypes.SET_APP_PERMISSION, appName, permissions };
}

export function getAppPermission(clientId, appName) {
  return (dispatch) => {
    axios.get('/auth/permissionList')
      .then(response => response.data)
      .then((permissions) => {
        dispatch(setAppPermission(appName, permissions));
      });
  };
}
