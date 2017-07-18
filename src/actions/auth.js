import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import { createAction } from 'redux-actions';

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
        headers: new Headers({ Authorization: token })
      })
        .then(res => res.json())
        .then(data => {
          dispatch(authenticateSuccess({
            user: data.account,
            token,
          }));
        })
        .catch((err) => {
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
    const to = next ? next : '/';
    browserHistory.push(to);
  };
