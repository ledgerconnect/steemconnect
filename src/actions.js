var _ = require('lodash'),
	axios = require('axios'),
	steemAuth = require('steemauth'),
	cookie = require('./../lib/cookie'),
	C = require('./constants');

module.exports = {
	login: function(username, passwordOrWif) {
		return function(dispatch, getState) {
			var isWif = steemAuth.isWif(passwordOrWif);
			console.log('isWif', isWif);
			var wif = (isWif)? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'posting');
			console.log(steemAuth.wifToPublic(wif));
			var req = {type: C.LOGIN_REQUEST};
			Object.assign(req);
			dispatch(req);
			axios.get('//api.steemjs.com/getAccounts?names[]=' + username).then(function(response) {
					if (!_.has(response, 'data[0].owner')) {
						res = {
							type: C.LOGIN_FAILURE,
							user: {},
							errorMessage: 'Incorrect Username'
						};
						Object.assign(res);
						dispatch(res);
					} else if (steemAuth.wifIsValid(wif, response.data[0].posting.key_auths[0][0])) {
						res = {
							type: C.LOGIN_SUCCESS,
							user: {name: username},
							errorMessage: ''
						};
						cookie.save(username, wif);
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
				});
		}.bind(this);
	},
	logout: function() {
		cookie.clear();
		//return {type: C.LOGIN_REQUEST};
	}
};