import _ from 'lodash';
import steem from 'steem';
import * as authTypes from './auth/authAction';
import utils from '../lib/utils';
import cookie from '../lib/cookie';

export function updateProfile(username) {
  return (dispatch) => {
    steem.api.getAccounts([username], (err, result) => {
      if (!result || !result[0]) {
        throw new Error('user not found');
      }
      const { memo_key, reputation, balance, name, sbd_balance } = result[0];
      let { json_metadata } = result[0];
      json_metadata = utils.parseJson(json_metadata);
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
    fetch('/api/@steemconnect/verify', {
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
    const isWif = steem.auth.isWif(passwordOrWif);
    const activeKey = (isWif) ? passwordOrWif : steem.auth.toWif(username, passwordOrWif, 'active');
    return new Promise((resolve, reject) => {
      steem.broadcast.accountUpdate(activeKey, username, undefined, undefined, undefined,
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
    const json_metadata = typeof user.json_metadata === 'object' ? user.json_metadata : {};
    user.json_metadata = json_metadata;
    json_metadata.profile = json_metadata.profile || {};
    const profileData = json_metadata.profile;
    let uploadUrl = `https://img.steemconnect.com/@${user.name}`;
    if (type === 'cover_image') {
      uploadUrl += '/cover';
    }
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', uploadUrl, true);
      // Send the proper header information along with the request
      request.setRequestHeader('Content-Type', file.type);
      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 201) {
          try { profileData[type] = JSON.parse(request.response).url; } catch (e) { }
          return resolve(dispatch(accountUpdate(user.name,
            passwordOrWif, user.memo_key, json_metadata)));
        } else if (request.status >= 400) {
          return reject(new Error('Could not set upload image'));
        }
      };
      request.send(file);
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
  return (dispatch, getState) => {
    const { auth: { user: { name } } } = getState();

    let lastUser = cookie.get('lastUsers');
    if (!_.isArray(lastUser)) { lastUser = []; }

    lastUser = [name].concat(lastUser);
    lastUser = _.uniq(lastUser);

    cookie.save(lastUser, 'lastUsers');
    cookie.remove('auth');
    dispatch({ type: authTypes.LOGOUT_SUCCESS });
  };
}
