import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import { createAction } from 'redux-actions';
import { getAccounts } from '../utils/localStorage';

export const AUTHENTICATE_REQUEST = '@auth/AUTHENTICATE_REQUEST';
export const authenticateRequest = createAction(AUTHENTICATE_REQUEST);
export const AUTHENTICATE_SUCCESS = '@auth/AUTHENTICATE_SUCCESS';
export const authenticateSuccess = createAction(AUTHENTICATE_SUCCESS);
export const AUTHENTICATE_FAILURE = '@auth/AUTHENTICATE_FAILURE';
export const authenticateFailure = createAction(AUTHENTICATE_FAILURE);

export const LOGOUT_REQUEST = '@auth/LOGOUT_REQUEST';
export const logoutRequest = createAction(LOGOUT_REQUEST);
export const LOGOUT_SUCCESS = '@auth/LOGOUT_SUCCESS';
export const logoutSuccess = createAction(LOGOUT_SUCCESS);

export const authenticate = () =>
  (dispatch) => {
    dispatch(authenticateRequest());
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/me', {
        method: 'POST',
        headers: new Headers({ Authorization: token }),
      })
        .then(res => res.json())
        .then((data) => {
          const accounts = getAccounts();
          const idx = accounts.findIndex(acc => acc.username === data.name);
          if (idx >= 0) {
            accounts[idx].postingAuths = data.account.posting.account_auths;
          } else {
            accounts.push({
              username: data.name,
              token,
              postingAuths: data.account.posting.account_auths,
            });
          }
          localStorage.setItem('accounts', JSON.stringify(accounts));
          dispatch(authenticateSuccess({
            user: data.account,
            token,
          }));
        })
        .catch(() => {
          dispatch(authenticateFailure());
        });
    } else {
      dispatch(authenticateFailure());
    }
  };

export const logout = (next = false) =>
  (dispatch) => {
    dispatch(logoutRequest());
    localStorage.removeItem('token');
    dispatch(logoutSuccess());
    const to = next || '/';
    browserHistory.push(to);
  };
