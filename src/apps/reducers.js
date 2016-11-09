import _ from 'lodash';
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
    case types.GET_MYAPPLIST_REQUEST:
    case types.DISCONNECT_APP_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        errorMessage: '',
      });
    case types.GET_APPLIST_FAILURE:
    case types.GET_MYAPPLIST_FAILURE:
    case types.DISCONNECT_APP_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.errorMessage,
      });
    case types.GET_APPLIST_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: '',
        appList: _.chain(action.appList)
                    .concat(state.appList)
                    .uniqBy('id')
                    .sortBy('id')
                    .value(),
      });
    case types.GET_MYAPPLIST_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: '',
        myAppList: _.sortBy(action.myAppList, 'id'),
      });
    case types.DISCONNECT_APP_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: '',
        myAppList: _.filter(state.myAppList, appDetails => appDetails.app !== action.removed),
      });
    default:
      return state;
  }
};
