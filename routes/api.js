var express = require('express'),
	router = express.Router(),
	steem = require('steem');

router.get('/api/verify', function(req, res, next) {
	res.json({
		username: 'siol',
		permissions: ['verify', 'vote']
	});
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