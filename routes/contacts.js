const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { Contact, User } = db;



router.get('/', csrfProtection, asyncHandler(async (req, res, next) => {
  if (!res.locals.userId) {
    res.redirect('/users/login')
  }

  res.render('add-contact')
}))

const invalidContact = (value) => {
  const err = Error("Invalid input");
  err.errors = [`You entered an invalid email address, or this email is currently in your contacts.`];
  err.title = "Invalid input";
  err.status = 404;
  return err;
};

const duplicateContact = (value) => {
  const err = Error("Invalid input");
  err.errors = [`You entered an invalid email address, or this email is currently in your contacts.`];
  err.title = "Invalid input";
  err.status = 418;
  return err;
};

router.post('/', asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const userId = res.locals.userId;
  const userContact = await User.findAll({
    where: {
      email
    }
  })

if(userContact.length) {
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
    res.status(201).json({ contact })
  } else {
    next(duplicateContact(email))
  }

  } else {
    next(invalidContact(email))
  }

}))

router.delete('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const contactId = req.params.id;
  if (contactId) {
    await Contact.destroy({
      where: {
        contactId
      }
    });
    res.status(204).end();
  } else {
    next(listNotFoundError(req.params.id))
  }
}))


module.exports = router;
