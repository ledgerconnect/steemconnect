var express = require('express');
var router = express.Router();

router.get('/*', function(req, res, next) {
  var ip = req.ip || null;
  var ua = req.headers['user-agent'] || null;
  var language = req.headers['accept-language'] || null;
  console.log(ua, language, ip);
  res.render('user/dashboard', {layout: 'user', title: 'Steem Connect'});
});

module.exports = router;