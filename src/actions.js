import fetch from 'isomorphic-fetch';
import { createAction } from 'redux-actions';

export const AUTHENTICATE_REQUEST = '@app/AUTHENTICATE_REQUEST';
export const authenticateRequest = createAction(AUTHENTICATE_REQUEST);
export const AUTHENTICATE_SUCCESS = '@app/AUTHENTICATE_SUCCESS';
export const authenticateSuccess = createAction(AUTHENTICATE_SUCCESS);
export const AUTHENTICATE_FAILURE = '@app/AUTHENTICATE_FAILURE';
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
