import fetch from 'isomorphic-fetch';
import { createAction } from 'redux-actions';

export const AUTHENTICATE_REQUEST = '@auth/AUTHENTICATE_REQUEST';
export const authenticateRequest = createAction(AUTHENTICATE_REQUEST);
export const AUTHENTICATE_SUCCESS = '@auth/AUTHENTICATE_SUCCESS';
export const authenticateSuccess = createAction(AUTHENTICATE_SUCCESS);
export const AUTHENTICATE_FAILURE = '@auth/AUTHENTICATE_FAILURE';
export const authenticateFailure = createAction(AUTHENTICATE_FAILURE);

export const authenticate = () =>
  (dispatch) => {
    dispatch(authenticateRequest());
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/me', {
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
