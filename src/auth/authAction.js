import _ from 'lodash';
import steem from 'steem';
import * as authTypes from './authActionTypes';
import PermissionList from '../../lib/PermissionList';

const steemAuth = require('steemauth');
const crypto = require('crypto-js');

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

    fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ encryptedData: encryptData(JSON.stringify({ username, wif })) }),
      credentials: 'include',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-csrf-token': document.querySelector('meta[name="_csrf"]').content,
      }),
    }).then(response => response.json())
      .then((data) => {
        const { error, userAccount, auth } = data;
        if (error) {
          throw error;
        } else if (userAccount && auth.length) {
          const { memo_key, reputation, balance } = userAccount;
          let { json_metadata } = userAccount;
          json_metadata = json_metadata.length ? JSON.parse(json_metadata) : {};
          dispatch({
            type: authTypes.LOGIN_SUCCESS,
            user: { name: username, json_metadata, memo_key, reputation, balance },
          });
          cookie.save(auth, 'auth');
        } else {
          throw new Error('Malformed request');
        }
      }).catch((err) => {
        const errorMessage = typeof err !== 'string' ? ((err.data && err.data.error) || err.statusText) : err;
        dispatch({
          type: authTypes.LOGIN_FAILURE,
          user: {},
          errorMessage,
        });
      });
  };
}

export function demoLogin() {
  return login('guest123', '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg');
}

export function setAppDetails(appName, appDetails) {
  return { type: authTypes.SET_APP_DETAILS, appName, appDetails };
}

export function getAppDetails(appUserName, redirectUrl) {
  return (dispatch) => {
    steem.api.getAccounts([appUserName], (err, result) => {
      if (err) {
        dispatch(setAppDetails(appUserName, { error: 'could not get app details' }));
      } else if (result && result[0]) {
        let { json_metadata = {} } = result[0];
        try { json_metadata = JSON.parse(json_metadata); } catch (e) { json_metadata = {}; }
        const app = json_metadata.app;

        if (app) {
          app.permissions = _.map(app.permissions, v => Object.assign(PermissionList[v], { api: v }));
          app.redirect_urls = app.redirect_urls || [];

          // If there is list of redirect_url that developer must specify
          // if there is only one that it will be selected automatically
          if (app.redirect_urls.length > 1 && app.redirect_urls.indexOf(redirectUrl) === -1) {
            dispatch(setAppDetails(appUserName, { error: 'RedirectUrl Mismatch' }));
          } else {
            app.redirect_url = redirectUrl || app.redirect_urls[0];
            dispatch(setAppDetails(appUserName, app));
          }
        } else {
          dispatch(setAppDetails(appUserName, { error: 'app is not configured' }));
        }
      } else {
        dispatch(setAppDetails(appUserName, { error: 'Invalid app' }));
      }
    });
  };
}
