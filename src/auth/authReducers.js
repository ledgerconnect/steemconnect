import * as authTypes from './authActionTypes';

module.exports = function (state, action) {
	switch (action.type) {
		case authTypes.LOGIN_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				isAuthenticated: false,
				errorMessage: '',
				user: []
			});
		case authTypes.LOGIN_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: true,
				errorMessage: '',
				user: action.user
			});
		case authTypes.LOGIN_FAILURE:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: false,
				errorMessage: action.errorMessage
			});
		case authTypes.LOGOUT_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: false
			});
		case authTypes.UPDATE_PROFILE:
			return Object.assign({}, state, {
				user: Object.assign(state.user, action.user)
			});
		default: return state || initialState().auth;
	}
};
