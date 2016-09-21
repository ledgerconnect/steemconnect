const express = require('express');

const router = new express.Router();

router.get('/*', (req, res) => {
  res.render('user/dashboard', { layout: 'user', title: 'Steem Connect', csrfToken: req.csrfToken() });
});

module.exports = router;
