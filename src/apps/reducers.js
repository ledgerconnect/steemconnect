import * as types from './actions';

const initialState = {
  isFetching: false,
  errorMessage: '',
  appList: [],
  myAppList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_APPLIST_REQUEST:
      return {
        isFetching: true,
        errorMessage: '',
        appList: [],
      };
    case types.GET_APPLIST_FAILURE:
      return {
        isFetching: false,
        errorMessage: action.errorMessage,
        appList: action.appList,
      };
    case types.GET_APPLIST_SUCCESS:
      return {
        isFetching: false,
        errorMessage: '',
        appList: action.appList,
      };
    default:
      return state;
  }
};
