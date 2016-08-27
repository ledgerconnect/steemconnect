var express = require('express'),
	router = express.Router(),
	steem = require('steem'),
	cookie = require('./../lib/cookie');

router.get('/api/verify', function(req, res, next) {
	if (cookie.get()) {
		res.json({
			isAuthenticated: true,
			username: 'siol',
			permissions: ['verify', 'vote']
		});
	} else {
		res.json({
			isAuthenticated: false
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