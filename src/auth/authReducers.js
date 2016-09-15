import * as authTypes from './authActionTypes';

const initialState = {
  isAuthenticated: false,
  isFetching: false,
  errorMessage: '',
  user: {
    name: 'fabien',
    recentActivities: {},
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authTypes.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        errorMessage: '',
        user: []
      };
    case authTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        user: action.user
      };
    case authTypes.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.errorMessage
      };
    case authTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false
      };
    case authTypes.UPDATE_PROFILE:
      return {
        ...state,
        user: Object.assign(state.user, action.user)
      };
    default:
      return state;
  }
};
