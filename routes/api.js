var express = require('express'),
	router = express.Router(),
	_ = require('lodash'),
	steem = require('steem'),
	cookie = require('./../lib/cookie');

router.get('/api/verify', function(req, res, next) {
	var auth = (req.cookies['_sc_a'])? JSON.parse(req.cookies['_sc_a']) : cookie.get();
	if (_.has(auth, 'username')) {
		res.json({
			isAuthenticated: true,
			username: auth.username,
			permissions: ['verify', 'vote']
		});
	} else {
		res.json({
			isAuthenticated: false
		})
	}
});

router.get('/api/vote', function(req, res, next) {
	var auth = (req.cookies['_sc_a'])? JSON.parse(req.cookies['_sc_a']) : cookie.get();
	if (_.has(auth, 'username')) {
		var voter = req.query.voter,
			author = req.query.author,
			permlink = req.query.permlink,
			weight = req.query.weight;
		console.log(auth.wif, voter, author, permlink, weight);
		steem.broadcast.vote(auth.wif, 'siol', 'calaber24p', 'why-have-we-as-a-nation-given-up-our-right-to-privacy', 10000, function(err, result) {
			console.log(err, result);
		});
		res.json({
			isAuthenticated: false
		})
	} else {
		res.json({
			isAuthenticated: false
		})
	}
});

router.get('/api/comment', function(req, res, next) {
	res.json({
		error: '',
		x: '1'
	});
});

module.exports = router;