var cookies = require('js-cookie');

module.exports = {
	save: function (username, wif) {
		var auth = {
			username: username,
			wif: wif
		};
		var token = JSON.stringify(auth);
		cookies.set('_sc_a', token, {path: '/', secure: true, expires: 60 * 60 * 24});
		return token;
	},
	get: function () {
		var auth = cookies.get('_sc_a');
		if (!auth) return '';
		return JSON.parse(auth);
	},
	clear: function () {
		cookies.set('_sc_a', '', {path: '/', secure: true, expires: -1});
	}
};