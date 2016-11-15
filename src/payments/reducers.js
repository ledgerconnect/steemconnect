import * as types from './actions';

const initialState = {
  isFetching: false,
  errorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.TRANSFER_STEEM_REQUEST:
      return {
        isFetching: true,
        errorMessage: '',
      };
    case types.TRANSFER_STEEM_FAILURE:
      return {
        isFetching: false,
        errorMessage: action.errorMessage,
        app: action.app,
      };
    case types.TRANSFER_STEEM_SUCCESS:
      return {
        isFetching: false,
        errorMessage: '',
        app: action.app,
      };
    default:
      return state;
  }
};
