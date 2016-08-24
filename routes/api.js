var express = require('express');
var router = express.Router();

var utils = require('./../lib/utils'),
  Cookies = require('cookies'),
  jwt = require('jwt-simple');

router.get('/verify', function(req, res) {
  var cookies = new Cookies(req, res);
  //var token = cookies.get('sc:a');
  var token = 'TOKEN';
  var isAuthenticated = false;
  var username = '';
  if (jwt.verify(token, req.headers['user-agent'])) {
    var auth = jwt.decode(token, req.headers['user-agent']);
    username = auth.username;
    isAuthenticated = true;
  }
  res.json({
    isAuthenticated: isAuthenticated,
    username: username
  });
});


module.exports = router;