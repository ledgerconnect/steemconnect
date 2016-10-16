const express = require('express');

const router = new express.Router();

router.get('/*', (req, res) => {
  res.render('index', { title: 'Steem Connect', csrfToken: req.csrfToken() });
});

module.exports = router;
