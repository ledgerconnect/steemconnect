var _ = require('lodash'),
	axios = require('axios'),
	steemAuth = require('steemauth'),
	steem = require('steem'),
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
						var res = {
							type: C.LOGIN_FAILURE,
							user: {},
							errorMessage: 'Incorrect Username'
						};
						Object.assign(res);
						dispatch(res);
					} else if (steemAuth.wifIsValid(wif, response.data[0].posting.key_auths[0][0])) {
						console.log(response.data[0]);
						let json_metadata = response.data[0].json_metadata;
						let profile = json_metadata.length ? JSON.parse(json_metadata) : {}; 
						console.log(profile);
						var res = {
							type: C.LOGIN_SUCCESS,
							user: { name: username, memoKey: response.data[0].memo_key, profile },
							errorMessage: ''
						};
						cookie.save(username, wif);
						Object.assign(res);
						dispatch(res);
					} else {
						var res = {
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
			var data = new FormData();
			data.append('file', file);
			axios.post('https://img.busy6.com/@' + username, data,{
				origin: true
			}).then(function(data){
				var res = {
					type: C.SET_AVATAR,
					user: {selectAvatar:false}
				};
				Object.assign(res);
				dispatch(res);
			}).catch(function(err){
				console.error('Error While Setting Avatar', err);
			});
		}
	},
	changeAvatar: function(){
		return {
			type: C.SET_AVATAR,
			user: { selectAvatar: true }
		};
	},
	updateProfile: function(passwordOrWif,profileData){
		return function (dispatch, getState) {
			let {auth: {user}} = getState();
			let username = user.name;
			var ownerKey = steemAuth.toWif(username, passwordOrWif, 'owner');
			var jsonMetadata = profileData;
			console.log(ownerKey, user.memoKey);
			steem.broadcast.accountUpdate(ownerKey, username, undefined, undefined, undefined, user.memoKey, jsonMetadata, function (err, result) {
				console.log('result', result);
				console.log('error', JSON.stringify(err));
				var res = {
					type: C.UPDATE_PROFILE,
					user: { profile: profileData }
				};
				Object.assign(res);
				dispatch(res);
			});
		}
	}
};