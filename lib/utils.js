var jwt = require('jsonwebtoken');

module.exports = {
	generateToken: function (user) {
		var u = {name: user.name};
		return token = jwt.sign(u, process.env.JWT_SECRET, {
			expiresIn: 20
		});
	}
};