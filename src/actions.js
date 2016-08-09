var _ = require('lodash'),
	axios = require('axios'),
	steemConnect = require('steemconnect'),
	C = require('./constants');

module.exports = {
	login: function(username, password) {
		return function(dispatch, getState) {
			var req = {type: C.LOGIN_REQUEST};
			Object.assign(req);
			dispatch(req);
			steemConnect.token.get(username, password, function(err, token){
				var res = {};
				if (err) {
					res = {
						type: C.LOGIN_FAILURE,
						user: {},
						errorMessage: 'Incorrect Username or Password'
					};
				} else {
					res = {
						type: C.LOGIN_SUCCESS,
						user: {
							name: username,
							token: token
						},
						errorMessage: ''
					};
				}
				console.log(res);
				Object.assign(res);
				dispatch(res);
			});
		};
	}
};