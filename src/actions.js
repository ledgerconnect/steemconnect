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
			axios.get('//api.steemjs.com/getAccounts?names[]=' + username)
				.then(response => {
					if (_.has(response, 'data[0].owner')) {
						if (steemConnect.auth.verify(username, password, {
							owner: response.data[0].owner.key_auths,
							active: response.data[0].active.key_auths,
							posting: response.data[0].posting.key_auths,
						})) {
							res = {
								type: C.LOGIN_SUCCESS,
								user: {name: username},
								errorMessage: ''
							};
							Object.assign(res);
							dispatch(res);
						} else {
							res = {
								type: C.LOGIN_FAILURE,
								user: {},
								errorMessage: 'Incorrect Password'
							};
							Object.assign(res);
							dispatch(res);
						}
					} else {
						res = {
							type: C.LOGIN_FAILURE,
							user: {},
							errorMessage: 'Incorrect Username'
						};
						Object.assign(res);
						dispatch(res);
					}
				});
		}.bind(this);
	}
};