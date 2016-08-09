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
			axios.get('//api.steemjs.com/getAccounts?names[]=' + username + '&ws=' + C.WS)
				.then(response => {
					if (_.has(response, 'data[0].owner')) {
						var isValid = steemConnect.isValid(username, password, {
							owner: response.data[0].owner.key_auths,
							active: response.data[0].active.key_auths,
							posting: response.data[0].posting.key_auths
						});
						var type = (isValid)? C.LOGIN_SUCCESS : C.LOGIN_FAILURE;
						var errorMessage = (isValid)? '' : 'Incorrect Password';
						var res = {
							type: type,
							user: response.data[0],
							errorMessage: errorMessage
						};
					} else {
						var res = {
							type: C.LOGIN_FAILURE,
							user: response.data[0],
							errorMessage: 'Username does not exist'
						};
					}
					console.log(res);
					Object.assign(res);
					dispatch(res);
				});
		};
	}
};