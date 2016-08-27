var express = require('express'),
	router = express.Router(),
	_ = require('lodash'),
	steem = require('steem'),
	cookie = require('./../lib/cookie');

router.get('/api/verify', function(req, res, next) {
	var auth = cookie.get();
	if (_.has(auth, 'username')) {
		res.json({
			isAuthenticated: true,
			username: auth.username,
			permissions: ['verify', 'vote']
		});
	} else {
		res.json({
			isAuthenticated: false,
			auth: auth
		})
	}
});

router.get('/api/vote', function(req, res, next) {
	res.json({
		error: ''
	});
});

router.get('/api/comment', function(req, res, next) {
	res.json({
		error: ''
	});
});

module.exports = router;