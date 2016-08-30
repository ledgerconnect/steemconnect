var C = require("../constants"),
	initialState = require("../initialstate");

module.exports = function(state,action){
	switch(action.type){
		case C.LOGIN_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				isAuthenticated: false,
				errorMessage: '',
				user: []
			});
		case C.LOGIN_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: true,
				errorMessage: '',
				user: action.user
			});
		case C.LOGIN_FAILURE:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: false,
				errorMessage: action.errorMessage
			});
		case C.LOGOUT_SUCCESS:
			return Object.assign({}, state, {
				isFetching: true,
				isAuthenticated: false
			});
		case C.SET_AVATAR:
			return Object.assign({}, state, {
				user: Object.assign(state.user, action.user)
			});
		default: return state || initialState().auth;
	}
};