import { createAction } from 'redux-actions';

export const SET_LOCALE = '@app/SET_LOCALE';
export const setLocaleRequest = createAction(SET_LOCALE);
export const setLocale = locale =>
  (dispatch) => {
    dispatch(setLocaleRequest({ locale }));
  };
