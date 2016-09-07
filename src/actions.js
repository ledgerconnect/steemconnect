var _ = require('lodash'),
	axios = require('axios'),
	steemAuth = require('steemauth'),
	steem = require('steem'),
	cookie = require('./../lib/cookie'),
	validator = require('validator'),
	C = require('./constants');

function login(username, passwordOrWif) {
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
}

function logout() {
	cookie.clear();
	return { type: C.LOGOUT_SUCCESS };
}

function setAvatar(passwordOrWif, file, type) {
	return function (dispatch, getState) {
		let state = getState();
		let user = state.auth.user;
		let profileData = user.profile;
		var data = new FormData();
		data.append('file', file);
		let uploadUrl = 'https://img.busy6.com/@' + user.name;
		if (type === 'cover_image')
			uploadUrl += '/cover';
		axios.post(uploadUrl, data, { origin: true })
			.then(function (data) {
				let {data: {url}} = data;
				profileData[type] = url ? url : uploadUrl;
				
				dispatch(accountUpdate(user.name, passwordOrWif, user.memo_key, { profile: profileData }));
			}).catch(function (err) {
				console.error('Error While Setting Avatar', err);
			});
	}
}

function updateProfile(passwordOrWif, profileData) {
	return function (dispatch, getState) {
		var state = getState();
		var user = state.auth.user;
		if (typeof user.profile === 'object')
			profileData = Object.assign(user.profile, profileData);

		dispatch(accountUpdate(user.name, passwordOrWif, user.memo_key, { profile: profileData }));
	}
}

function accountUpdate(username, passwordOrWif, memo_key, jsonMetadata) {
	return function (dispatch, getState) {
		dispatch({ type: C.UPDATE_PROFILE, user: { isUpdatingProfile: true, isUpdatingProfileError: undefined } });
		var isWif = steemAuth.isWif(passwordOrWif);
		var ownerKey = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'owner');
		steem.broadcast.accountUpdate(ownerKey, username, undefined, undefined, undefined, memo_key, jsonMetadata, function (err, result) {
			err && console.error('Error while processing accountUpdate', JSON.stringify(err));
			dispatch({
				type: C.UPDATE_PROFILE,
				user: { profile: jsonMetadata.profile, isUpdatingProfile: false, isUpdatingProfileError: err ? true : false }
			});
		});
	}
}

function getAccountHistory(username, from, limit) {
	return (dispatch, getState) => {
		steem.api.getAccountHistory(username, from, limit, (err, result) => {
			err && console.error(err);
			dispatch({
				type: C.UPDATE_PROFILE,
				user: { accountHistory: result }
			});
		})
	}
}

module.exports = {
	login,
	logout,
	setAvatar,
	updateProfile,
	accountUpdate,
	getAccountHistory
};