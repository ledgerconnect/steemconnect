import * as types from '../actions/appLocale';

const initialState = {
  locale: 'en',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_LOCALE:
      return {
        ...state,
        locale: action.payload.locale,
      };
    default:
      return state;
  }
};
