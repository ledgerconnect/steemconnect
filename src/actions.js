var _ = require('lodash'),
	axios = require('axios'),
	steemConnect = require('steemconnect'),
	jwt = require('jsonwebtoken'),
	C = require('./constants');

module.exports = {
	login: function(username, password) {
		return function(dispatch, getState) {
			var req = {type: C.LOGIN_REQUEST};
			Object.assign(req);
			dispatch(req);
			var self = this;
			axios.get('//api.steemjs.com/getAccounts?names[]=' + username + '&ws=' + C.WS)
				.then(response => {
					if (_.has(response, 'data[0].owner')) {
						if (steemConnect.auth.verify(username, password, {
							owner: response.data[0].owner.key_auths,
							active: response.data[0].active.key_auths,
							posting: response.data[0].posting.key_auths,
						})) {
							var code = self.generateCode(username, password);
							steemConnect.token.get(code, function(err, token) {
								res = {
									type: C.LOGIN_SUCCESS,
									user: {name: username, token: token},
									errorMessage: ''
								};
								Object.assign(res);
								dispatch(res);
							});
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
	},
	generateCode: function(username, password) {
		var auth = {
			username: username,
			password: password
		};
		return jwt.sign(auth, navigator.userAgent, {expiresIn: 5})
	}
};