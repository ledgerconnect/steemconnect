import _ from 'lodash';
import steem from 'steem';
import crypto from 'crypto-js';
import PermissionList from '../../lib/permissions';
import cookie from '../../lib/cookie';
import utils from '../../lib/utils';

export const LOGIN_REQUEST = '@auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@auth/LOGIN_FAILURE';
export const SIGNUP_SUCCESS = '@auth/SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = '@auth/SIGNUP_FAILURE';
export const SIGNUP_REQUEST = '@auth/SIGNUP_REQUEST';
export const USERNAME_FAILURE = '@auth/USERNAME_FAILURE';
export const USERNAME_REQUEST = '@auth/USERNAME_REQUEST';
export const LOGIN_NO_COOKIE = '@auth/LOGIN_NO_COOKIE';
export const UPDATE_PROFILE = '@auth/UPDATE_PROFILE';
export const UPDATE_LAST_USER_LIST = '@auth/UPDATE_LAST_USER_LIST';
export const SET_APP_DETAILS = '@auth/SET_APP_DETAILS';
export const LOGOUT_SUCCESS = '@auth/LOGOUT_SUCCESS';

function encryptData(object) {
  const crfs = cookie.get('_csrf');
  if (typeof crfs !== 'string' || (typeof crfs === 'string' && crfs.length === 0)) {
    cookie.save(Date.now().toString(16), '_csrf', { secure: global.location.hostname !== 'localhost' });
  }
  return crypto.AES.encrypt(crypto.enc.Utf8.parse(object), cookie.get('_csrf')).toString();
}

export function setSelectedUser(username) {
  return { type: UPDATE_LAST_USER_LIST, lastUserList: { selected: username, show: false } };
}

export function selectLoginWithUserName(selected) {
  return (dispatch) => {
    dispatch({ type: USERNAME_REQUEST });
    steem.api.getAccounts([selected], (err, result) => {
      if (result.length) {
        dispatch(setSelectedUser(selected));
      } else {
        dispatch({ type: USERNAME_FAILURE, errorMessage: 'Incorrect username' });
      }
    });
  };
}

export function ShowLastUserList() {
  return { type: UPDATE_LAST_USER_LIST, lastUserList: { show: true } };
}

export function login(username, passwordOrWif) {
  return (dispatch) => {
    const isWif = steem.auth.isWif(passwordOrWif);
    const wif = (isWif) ? passwordOrWif : steem.auth.toWif(username, passwordOrWif, 'posting');
    dispatch({ type: LOGIN_REQUEST });

    return fetch('/auth/login', {
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
        const { error, userAccount } = data;
        if (error) {
          throw error;
        } else if (userAccount) {
          const { memo_key, reputation, balance } = userAccount;
          let { json_metadata } = userAccount;
          json_metadata = utils.parseJson(json_metadata);
          dispatch({
            type: LOGIN_SUCCESS,
            user: { name: username, json_metadata, memo_key, reputation, balance },
          });
        } else {
          throw new Error('Malformed request');
        }
      }).catch((err) => {
        const errorMessage = typeof err !== 'string' ? err.message : err;
        dispatch({
          type: LOGIN_FAILURE,
          user: {},
          errorMessage,
        });
      });
  };
}

export function signup(username, password) {
  return (dispatch) => {
    dispatch({ type: SIGNUP_REQUEST });
    return fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ encryptedData: encryptData(JSON.stringify({ username, password })) }),
      credentials: 'include',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-csrf-token': document.querySelector('meta[name="_csrf"]').content,
      }),
    }).then(response => response.json())
      .then((data) => {
        if (data.error) { throw new Error(data.error); }
        dispatch({ type: SIGNUP_SUCCESS });
      }).catch((err) => {
        const errorMessage = typeof err !== 'string' ? err.message : err;
        dispatch({
          type: SIGNUP_FAILURE,
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
  return { type: SET_APP_DETAILS, appName, appDetails };
}

export function getAppDetails(appUserName, redirectUrl = '') {
  return dispatch => fetch(`/auth/app/@${appUserName}`, {
    method: 'GET',
    credentials: 'include',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-csrf-token': document.querySelector('meta[name="_csrf"]').content,
    }),
  })
    .then(response => response.json())
    .then((response) => {
      const app = response;
      app.permissions = _.map(app.permissions,
        v => Object.assign(PermissionList[v], { api: v }));
      app.redirect_urls = app.redirect_urls || [];
      const redirectUrlExist = redirectUrl.indexOf('http') === 0;
      // If there is list of redirect_url that developers must specify
      // if there is only one that it will be selected automatically
      if (redirectUrlExist && app.redirect_urls.length >= 1 &&
        app.redirect_urls.indexOf(redirectUrl) === -1) {
        dispatch(setAppDetails(appUserName, { error: 'RedirectUrl Mismatch' }));
      } else {
        app.redirect_url = redirectUrlExist ? redirectUrl : app.redirect_urls[0];
        dispatch(setAppDetails(appUserName, app));
      }
      return app;
    }).catch((err) => {
      console.log('err', err);
      const errorMessage = typeof err !== 'string' ? ((err.data && err.data.error) || err.statusText) : err;
      dispatch(setAppDetails(appUserName, { error: errorMessage }));
    });
}
