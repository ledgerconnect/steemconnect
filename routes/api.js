var express = require('express'),
	router = express.Router(),
	_ = require('lodash'),
	steem = require('steem'),
	jwt = require('jsonwebtoken'),
	cookie = require('./../lib/cookie');

const {getSecretKeyForClientId, decrypMessage} = require('../lib/utils');

router.use('/api', function (req, res, next) {
	if (req.cookies.token && typeof req.headers.authorization === 'undefined') {
        req.headers.authorization = 'Bearer ' + req.cookies.token;
	}
	if (typeof req.headers.authorization !== 'undefined' && (req.headers.authorization.search('Bearer ') === 0)) {
		let token = req.headers.authorization.substring('Bearer '.length)
		jwt.verify(token, process.env.JWT_SECRET, (err, jwtData) => {
			if (err) {
				console.log('err', err);
				res.sendStatus(401);
			} else {
				let computeSecret = getSecretKeyForClientId(process.env.PUBLIC_KEY);
				let message = decrypMessage(jwtData.secret, computeSecret);
				message = JSON.parse(message);
				if (message.username == jwtData.username) {
					_.each(jwtData, (value, key) => {
						req[key] = value;
					})
					_.each(message, (value, key) => {
						req[key] = value;
					})
					next();
				} else {
					res.sendStatus(401);
				}

			}
		})
    } else {
		res.sendStatus(401);
	}
});

router.get('/api/getAccount', function (req, res, next) {
	steem.api.getAccounts([req.username], (err, result) => {
		res.send({ err, result })
	});
});

router.get('/api/verify', function (req, res, next) {
	var auth = (req.cookies['_sc_a']) ? JSON.parse(req.cookies['_sc_a']) : cookie.get();
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

router.get('/api/vote', function (req, res, next) {
	var auth = (req.cookies['_sc_a']) ? JSON.parse(req.cookies['_sc_a']) : cookie.get();
	if (_.has(auth, 'username')) {
		var voter = req.query.voter,
			author = req.query.author,
			permlink = req.query.permlink,
			weight = parseInt(req.query.weight);
		steem.broadcast.vote(auth.wif, voter, author, permlink, weight, function (err, result) {
			res.json({
				error: err,
				result: result
			});
		});

	} else {
		res.json({
			isAuthenticated: false
		})
	}
});

router.get('/api/comment', function (req, res, next) {
	var auth = (req.cookies['_sc_a']) ? JSON.parse(req.cookies['_sc_a']) : cookie.get();
	if (_.has(auth, 'username')) {
		var parentAuthor = req.query.parentAuthor,
			parentPermlink = req.query.parentPermlink,
			author = req.query.author,
			permlink = req.query.permlink,
			title = req.query.title,
			body = req.query.body,
			jsonMetadata = req.query.jsonMetadata;
		steem.broadcast.comment(auth.wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, result) {
			res.json({
				error: err,
				result: result
			});
		});

	} else {
		res.json({
			isAuthenticated: false
		})
	}
});

router.get('/api/accountCreate', function (req, res, next) {
	var fee = req.query.fee,
		creator = req.query.creator,
		newAccountName = req.query.newAccountName,
		owner = req.query.owner,
		active = req.query.active,
		posting = req.query.posting,
		memoKey = req.query.memoKey,
		jsonMetadata = req.query.jsonMetadata;
	steem.broadcast.accountCreate(auth.wif, fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata, function (err, result) {
		res.json({
			error: err,
			result: result
		});
	});
});

router.get('/api/customJson', function (req, res, next) {
	var auth = (req.cookies['_sc_a']) ? JSON.parse(req.cookies['_sc_a']) : cookie.get();
	if (_.has(auth, 'username')) {
		var requiredAuths = req.query.requiredAuths,
			requiredPostingAuths = req.query.requiredPostingAuths,
			id = req.query.id,
			json = req.query.json;
		steem.broadcast.customJson(auth.wif, requiredAuths, requiredPostingAuths, id, json, function (err, result) {
			res.json({
				error: err,
				result: result
			});
		});

	} else {
		res.json({
			isAuthenticated: false
		})
	}
});

module.exports = router;