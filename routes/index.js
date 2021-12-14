var express = require('express');
const { csrfProtection, asyncHandler, handleValidationErrors } = require("../utils");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (res.locals.authenticated) {
    return res.redirect('/app')
  }
  res.render('index', { title: 'Gotta Latte Do' });
});

router.get('/app', csrfProtection, function(req, res, next) {
  res.render('app', { csrfToken: req.csrfToken() })
})

module.exports = router;
