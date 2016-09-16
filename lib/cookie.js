var cookies = require('js-cookie');

cookies.removeAll = function (attributes) {
	Object.keys(cookies.get()).forEach(function (cookie) {
		cookies.remove(cookie, attributes);
	});
};

module.exports = {
	save: function (value, name) {
		// cookies.set(name, value, { path: '/', secure: true, expires: 60 * 60 * 24 });
		cookies.set(name, value, { path: '/', secure: location.hostname !== 'localhost', expires: 60 * 60 * 24 });
		return value;
	},
	get: function (name) {
		var auth = cookies.get(name);
		if (!auth) return '';
		try {
			auth = JSON.parse(auth)
		} catch (e) {

		}
		return auth;
	},
	clear: function () {
		console.log('Logout');
		cookies.removeAll({ path: '/', secure: location.hostname !== 'localhost' });
		// cookies.remove('_sc_a', '', { path: '/', secure: true });
		// cookies.remove('_sc_a', '', { path: '/', secure: location.hostname !== 'localhost' });
	}
};