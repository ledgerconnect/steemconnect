import * as appTypes from './appActionTypes';

const initialState = {
  isFetching: false,
  isLoaded: false,
  errorMessage: '',
  sidebarIsVisible: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case appTypes.SHOW_SIDEBAR:
      return Object.assign({}, state, {
        sidebarIsVisible: true,
      });
    case appTypes.HIDE_SIDEBAR:
      return Object.assign({}, state, {
        sidebarIsVisible: false,
      });
    default:
      return state;
  }
};
