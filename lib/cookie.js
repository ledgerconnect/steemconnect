var cookies = require('js-cookie');

module.exports = {
	save: function (value, name) {
		name = name || '_sc_a';
		// cookies.set(name, value, { path: '/', secure: true, expires: 60 * 60 * 24 });
		cookies.set(name, value, { path: '/', expires: 60 * 60 * 24 });
		return value;
	},
	get: function (name) {
		name = name || '_sc_a';
		var auth = cookies.get(name);
		if (!auth) return '';
		return JSON.parse(auth);
	},
	clear: function () {
		console.log('Logout');
		cookies.remove('_sc_a', '', { path: '/' });
		// cookies.remove('_sc_a', '', { path: '/', secure: true });
	}
};