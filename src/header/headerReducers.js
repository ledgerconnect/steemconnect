import * as headerTypes from './headerActionTypes';

const initialState = {
  menu: 'primary',
  tabs: [],
  query: '',
};

export default (state = initialState, action) => {
  switch(action.type) {
    case headerTypes.SEARCH:
      return {
        ...state,
        query: action.query
      };
    case headerTypes.SET_MENU:
      return {
        ...state,
        menu: action.menu
      };
    default:
      return state;
  }
};
