var express = require('express');
var router = express.Router();

var Steem = require('steem'),
  _ = require('lodash'),
  utils = require('./../lib/utils'),
  auth = require('./../lib/auth'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken');

router.all('/login', function(req, res) {
  var username = req.body.username || req.query.username;
  var password = req.query.password || req.query.password;
  var steem = new Steem();
  steem.getAccounts([username], function(err, result){
    if (err || !_.has(result, '[0].owner.key_auths')) {
      return res.status(404).json({
        error: true,
        errorCode: 404,
        errorMessage: 'Incorrect Username'
      });
    }
    var auths = {
      owner: result[0].owner.key_auths,
      active: result[0].active.key_auths,
      posting: result[0].posting.key_auths
    };
    var isValid = auth.verify(username, password, auths);
    if (isValid) {
      var token = utils.generateToken({name: username});
      res.json({
        user: username,
        token: token
      });
    } else {
      return res.status(404).json({
        error: true,
        errorCode: 404,
        errorMessage: 'Incorrect Password'
      });
    }
  });
});

router.all('/token', function(req, res) {
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(401).json({
      error: true,
      errorCode: 401,
      errorMessage: 'Incorrect Token'
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      return res.status(404).json({
        error: true,
        errorCode: 404,
        errorMessage: 'Incorrect Token'
      });
    }
    res.json({
      user: user,
      token: token
    });
  });
});


module.exports = router;