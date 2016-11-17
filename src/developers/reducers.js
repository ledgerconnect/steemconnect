import * as types from './actions';

const initialState = {
  isFetching: false,
  errorMessage: '',
  app: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_APP_REQUEST:
    case types.GET_APP_REQUEST:
    case types.DELETE_APP_REQUEST:
      return {
        isFetching: true,
        errorMessage: '',
        app: {},
      };
    case types.CREATE_APP_FAILURE:
    case types.GET_APP_FAILURE:
    case types.DELETE_APP_FAILURE:
      return {
        isFetching: false,
        errorMessage: action.errorMessage,
        app: action.app,
      };
    case types.CREATE_APP_SUCCESS:
    case types.GET_APP_SUCCESS:
      return {
        isFetching: false,
        errorMessage: '',
        app: action.app,
      };
    case types.DELETE_APP_SUCCESS:
      return {
        isFetching: false,
        errorMessage: '',
        app: {},
      };
    default:
      return state;
  }
};
