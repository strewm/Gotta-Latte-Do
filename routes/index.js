const express = require('express');
const { csrfProtection, asyncHandler, handleValidationErrors } = require("../utils");
const db = require('../db/models');
const { Contact, Task, User, List } = db;
const { Op } = require('sequelize');

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (res.locals.authenticated) {
    return res.redirect('/app')
  }
  res.render('index', { title: 'Gotta Latte Do' });
});


// Gets logged in user's home page
router.get('/app', csrfProtection, asyncHandler(async (req, res, next) => {
  if (!res.locals.userId) {
    res.redirect('/users/login')
  }

  const me = res.locals.userId
  const myName = await User.findByPk(me)

  const contacts = await Contact.findAll({
    where: {
      userId: res.locals.userId
    }
  })

  const myLists = await List.findAll({
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
  });

  const tasksGivenToMe = await Task.findAll({
    where: {
      givenTo: res.locals.userId
    }
  })

  const currUser = await User.findByPk(me)

  const today = new Date().setHours(0, 0, 0, 0);
  const overdue = await Task.findAll({
    where: {
      [Op.and]: [{
        dueDate: { [Op.lt]: today }
      },
      { isCompleted: false },
      { userId: me }
      ],
    }
  })

  res.render('app', { csrfToken: req.csrfToken(), contactsAll, tasks, tasksGivenToMe, currUser, me, myName, myLists, overdue })
}));




module.exports = router;
