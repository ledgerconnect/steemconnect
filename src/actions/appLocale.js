import { createAction } from 'redux-actions';

export const SET_LOCALE = '@app/SET_LOCALE';
export const setLocaleAction = createAction(SET_LOCALE);

export const setLocale = locale =>
  (dispatch) => {
    dispatch(setLocaleAction({ locale }));
  };
