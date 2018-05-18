const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/*', (req, res) => {
  res.render('index', {
    title: 'SteemConnect',
    jsversion: process.env.NODE_ENV === 'production' ? process.env.npm_package_version : new Date().getTime(),
  });
});

module.exports = router;
