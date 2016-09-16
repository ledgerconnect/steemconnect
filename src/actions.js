const axios = require('axios'),
	steemAuth = require('steemauth'),
	steem = require('steem'),
	cookie = require('./../lib/cookie'),
	validator = require('validator'),
	_ = require('lodash'),
	C = require('./constants');

function login(username, passwordOrWif) {
	return (dispatch, getState) => {
		let isWif = steemAuth.isWif(passwordOrWif);
		let wif = (isWif) ? passwordOrWif : steemAuth.toWif(username, passwordOrWif, 'posting');
		dispatch({ type: C.LOGIN_REQUEST });
		axios.get('/app/login', {
			params: {
				username, wif
			}
		}).then(({data}) => {
			let {error, userAccount, token} = data;
			if (error) {
				dispatch({
					type: C.LOGIN_FAILURE,
					user: {},
					errorMessage: error
				});
			} else if (userAccount && token.length) {
				let {json_metadata, memo_key, reputation, balance} = userAccount;
				json_metadata = json_metadata.length ? JSON.parse(json_metadata) : {};
				dispatch({
					type: C.LOGIN_SUCCESS,
					user: { name: username, profile: json_metadata.profile, memo_key, reputation, balance },
				});
				cookie.save(token, 'token');
			} else {
				dispatch({
					type: C.LOGIN_FAILURE,
					user: {},
					errorMessage: "Malformed request"
				});
			}
		});
	};
}

function getAccount() {
	return function (dispatch, getState) {
		let token = cookie.get('token');
		dispatch({ type: C.LOGIN_REQUEST });
		axios.get('/api/getAccount').then(({data: {err, result}}) => {
			if (err) {
				dispatch({
					type: C.LOGIN_FAILURE,
					user: {},
					errorMessage: JSON.stringify(err)
				});
			} else {
				let {json_metadata, memo_key, reputation, balance, name} = result[0];
				json_metadata = json_metadata.length ? JSON.parse(json_metadata) : {};
				dispatch({
					type: C.LOGIN_SUCCESS,
					user: { name, profile: json_metadata.profile, memo_key, reputation, balance },
				});
			}
		});
	}
}

function authorize() {
	return function (dispatch, getState) {
		dispatch({ type: C.AUTHORIZE_REQUEST });
		let token = cookie.get('token');
		if (token) {
			axios.get('/app/authorize', {
				params: {
					token
				}
			}).then(({data}) => { });
		} else { }
	}
}

function logout() {
	let userCookie = cookie.get();
	let lastUser = cookie.get('last_users');
	if (!_.isArray(lastUser))
		lastUser = [];

	if (userCookie.username) {
		lastUser = [userCookie.username].concat(lastUser);
		lastUser = _.uniq(lastUser);
	}
	cookie.clear();
	cookie.save(lastUser, 'last_users');
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
			uploadUrl += '/cover.sass';
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

function clearUpdatingProfileResult() {
	return {
		type: C.UPDATE_PROFILE,
		user: { isUpdatingProfile: undefined, isUpdatingProfileError: undefined }
	}
}
module.exports = {
	login,
	logout,
	setAvatar,
	accountUpdate,
	clearUpdatingProfileResult,
	getAccount,
	authorize,
	getAccountHistory
};