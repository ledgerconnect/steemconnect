var express = require('express');
var router = express.Router();

var utils = require('./../lib/utils'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  steemConnect = require('steemconnect');

router.all('/login', function(req, res) {
  var username = req.body.username || req.query.username;
  var password = req.query.password || req.query.password;
  var isValid = steemConnect.isValid(username, password, {posting: [['STM7SWWzw9LbzMvvS6WukeXNSqNSZAG5GJbh5u88DT7jGCWdrvgh1', 1]]});
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
      errorMessage: 'Incorrect Username or Password'
    });
  }
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