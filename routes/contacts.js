const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { Contact, User } = db;



// router.get('/', csrfProtection, asyncHandler(async (req, res, next) => {
//   if (!res.locals.userId) {
//     res.redirect('/users/login')
//   }

//   res.render('add-contact')
// }))

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


const contactValidator = [
  check("email")
    .exists({checkFalsy: true})
    .isEmail()
    .withMessage("Please provide an email address")
]

// Add a new contact for logged in user

router.post('/', csrfProtection, contactValidator, asyncHandler(async (req, res, next) => {

  const { email } = req.body;
  const userId = res.locals.userId;
  const userContact = await User.findAll({
    where: {
      email
    }
  })
  const validatorErrors = validationResult(req)
  console.log(validatorErrors)
  if (validatorErrors.isEmpty()) {
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
        res.status(200).json({})
      }

  }}else {
    res.status(200).json({})
}

}))


// Delete a contact
router.delete('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res, next) => {
  const contactId = req.params.id;
  if (contactId) {
    await Contact.destroy({
      where: {
        contactId
      }
    });
    res.status(204).end();
  } else {
    next(invalidContact(req.params.id))
  }
}))


module.exports = router;
