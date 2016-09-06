var _ = require('lodash'),
	axios = require('axios'),
	steemAuth = require('steemauth'),
	steem = require('steem'),
	cookie = require('./../lib/cookie'),
	validator = require('validator'),
	C = require('./constants');

module.exports = {
	login: function(username, passwordOrWif) {
		return (dispatch, getState) => {
			let isWif = steemAuth.isWif(passwordOrWif);
			let wif = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'posting');
			let req = { type: C.LOGIN_REQUEST };
			Object.assign(req);
			dispatch(req);
			axios.get('//api.steemjs.com/getAccounts?names[]=' + username).then(function (response) {
				if (!_.has(response, 'data[0].owner')) {
					let res = {
						type: C.LOGIN_FAILURE,
						user: {},
						errorMessage: 'Incorrect Username'
					};
					Object.assign(res);
					dispatch(res);
				} else if (steemAuth.wifIsValid(wif, response.data[0].posting.key_auths[0][0])) {
					let {json_metadata, memo_key, reputation, balance} = response.data[0];
					json_metadata = json_metadata.length ? JSON.parse(json_metadata) : {};
					let res = {
						type: C.LOGIN_SUCCESS,
						user: { name: username, profile: json_metadata.profile, memo_key, reputation, balance },
						errorMessage: ''
					};
					cookie.save(username, wif);
					Object.assign(res);
					dispatch(res);
				} else {
					let res = {
						type: C.LOGIN_FAILURE,
						user: {},
						errorMessage: 'Incorrect Password'
					};
					Object.assign(res);
					dispatch(res);
				}
			});
		};
	},
	logout: function() {
		cookie.clear();
		return {type: C.LOGOUT_SUCCESS};
	},
	setAvatar: function (passwordOrWif, file, type) {
		return function(dispatch, getState) {
			let state = getState();
			let user = state.auth.user;
			let username = user.name
			let profileData = user.profile;
			var data = new FormData();
			data.append('file', file);
			let uploadUrl = 'https://img.busy6.com/@' + username;
			if (type === 'cover_image')
				uploadUrl += '/cover';
			axios.post(uploadUrl, data, {
				origin: true
			}).then(function (data) {
				let {data: {url}} = data;
				profileData[type] = url ? url : uploadUrl;
				let res = { type: C.UPDATE_PROFILE, user: { profile: profileData } };
				Object.assign(res);
				let isWif = steemAuth.isWif(passwordOrWif);
				let ownerKey = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'owner');
				steem.broadcast.accountUpdate(ownerKey, username, undefined, undefined, undefined, user.memo_key, { profile: profileData }, function (err, result) {
					err && console.error('Error while save img data to json_metadata', JSON.stringify(err));
					dispatch(res);
				});
			}).catch(function (err) {
				console.error('Error While Setting Avatar', err);
			});
		}
	},
	updateProfile: function(passwordOrWif,profileData){
		return function (dispatch, getState) {
			var state = getState();
			var user = state.auth.user;
			var username = user.name
			var isWif = steemAuth.isWif(passwordOrWif);
			var ownerKey = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'owner');
			if(typeof user.profile === 'object')
				profileData = Object.assign(user.profile, profileData);
			//TODO Remove in next commit wont affect non affected users
			delete profileData.profile;
			var jsonMetadata = { profile: profileData };

			steem.broadcast.accountUpdate(ownerKey, username, undefined, undefined, undefined, user.memo_key, jsonMetadata, function (err, result) {
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