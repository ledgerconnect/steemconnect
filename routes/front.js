const express = require('express');
const router = express.Router();

router.get('/*', (req, res, next) => {
  const options = {};
  options.title = 'SteemConnect';
  options.username = req.username;
  res.render('index', options);
});

module.exports = router;
