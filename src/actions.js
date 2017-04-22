import { createAction } from 'redux-actions';

export const SET_USERNAME = '@app/SET_USERNAME';
export const setUsernameRequest = createAction(SET_USERNAME);
export const setUsername = username =>
  (dispatch) => {
    dispatch(setUsernameRequest({ username }));
  };
