const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { Contact, User } = db;


router.get('/', csrfProtection, asyncHandler(async (req, res, next) => {
    if(!res.locals.userId) {
      res.redirect('/users/login')
    }

    res.render('add-contact')
  }))

router.post('/', asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const userId = res.locals.userId;

  const userContact = await User.findAll({
    where: {
      email
    }
  })

  const contactCheck = await Contact.findAll({
    where: {
      userId,
      contactId: userContact[0].id
    }
  })

  if (!contactCheck.length && (userId !== userContact[0].id)) {
    const contact = await Contact.create({
      userId,
      contactId: userContact[0].id
    })
    res.status(201).json({contact})
  } else {
    throw error;
  }

}))


module.exports = router;
