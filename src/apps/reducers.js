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
      return {
        isFetching: true,
        errorMessage: '',
        appList: [],
      };
    case types.GET_APPLIST_FAILURE:
    case types.GET_MYAPPLIST_FAILURE:
      return {
        isFetching: false,
        errorMessage: action.errorMessage,
        appList: _.chain(action.appList)
                    .concat(state.appList)
                    .uniqBy('id')
                    .sortBy('id')
                    .value(),
      };
    case types.GET_APPLIST_SUCCESS:
      return {
        isFetching: false,
        errorMessage: '',
        appList: _.chain(action.appList)
                    .concat(state.appList)
                    .uniqBy('id')
                    .sortBy('id')
                    .value(),
      };
    case types.GET_MYAPPLIST_SUCCESS:
      return {
        isFetching: false,
        errorMessage: '',
        appList: _.chain(action.appList)
                    .concat(state.appList)
                    .uniqBy('id')
                    .sortBy('id')
                    .value(),
        myAppList: _.sortBy(action.appList, 'id'),
      };
    default:
      return state;
  }
};
