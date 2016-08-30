var _ = require('lodash'),
	axios = require('axios'),
	steemAuth = require('steemauth'),
	cookie = require('./../lib/cookie'),
	C = require('./constants');

module.exports = {
	login: function(username, passwordOrWif) {
		return function(dispatch, getState) {
			var isWif = steemAuth.isWif(passwordOrWif);
			var wif = (isWif)? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'posting');
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
		return {type: C.LOGOUT_SUCCESS};
	},
	setAvatar:function(username, file){
		return function(dispatch, getState) {
			var data = new FormData()
			data.append('file', file)
			axios.post('https://img.busy6.com/@' + username, data,{
				origin: true
			}).then(function(data){
				res = {
					type: C.SET_AVATAR,
					user: {selectAvatar:false,avatar: data.data && data.data.url}
				};
				Object.assign(res);
				dispatch(res);
			}).catch(function(err){
				console.error('Error While Setting Avatar', err);
			})
		}
	},
	changeAvatar: function(){
		return {
			type: C.SET_AVATAR,
			user: { selectAvatar: true }
		};
	}
};