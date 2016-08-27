var express = require('express'),
	router = express.Router(),
	_ = require('lodash'),
	steem = require('steem'),
	cookie = require('./../lib/cookie');

router.get('/api/verify', function(req, res, next) {
	var auth = req.cookies['_sc_a'];
	if (_.has(auth, 'username')) {
		var json = JSON.parse(auth);
		res.json({
			isAuthenticated: true,
			username: json.username,
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