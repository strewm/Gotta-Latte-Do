const express = require('express');
const { csrfProtection, asyncHandler, handleValidationErrors } = require("../utils");
const db = require('../db/models');
const { Contact } = db;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (res.locals.authenticated) {
    return res.redirect('/app')
  }
  res.render('index', { title: 'Gotta Latte Do' });
});

router.get('/app', csrfProtection, asyncHandler(async (req, res, next) => {
  console.log(res.locals.userId)
  const contacts = await Contact.findAll({
    where: {
      userId: res.locals.userId
    }
  })

  if (!contacts.length) {
    res.render('/app', { csrfToken: req.csrfToken()})
  } else {
    console.log(contacts)
    res.render('/app', { csrfToken: req.csrfToken(), contacts })
  }

}))

module.exports = router;
