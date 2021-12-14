const express = require('express');
const { csrfProtection, asyncHandler, handleValidationErrors } = require("../utils");
const db = require('../db/models');
const { Contact, Task, User } = db;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (res.locals.authenticated) {
    return res.redirect('/app')
  }
  res.render('index', { title: 'Gotta Latte Do' });
});

router.get('/app', csrfProtection, asyncHandler(async (req, res, next) => {
  if(!res.locals.userId) {
    res.redirect('/users/login')
  }

  const contacts = await Contact.findAll({
    where: {
      userId: res.locals.userId
    }
  })

  let contactsAll = [];

  contacts.forEach(async (ele) => {
    let contactsList = await User.findByPk(ele.contactId)
    contactsAll.push(contactsList)
  })

  const tasks = await Task.findAll({
    where: {
      userId: res.locals.userId
    }
  })

    res.render('app', { csrfToken: req.csrfToken(), contactsAll, tasks })


}))

// // Get method that allows Sav to see /app
// router.get('/app', csrfProtection, asyncHandler(async (req, res, next) => {
//   res.render('app', { csrfToken: req.csrfToken() })
// }))


module.exports = router;
