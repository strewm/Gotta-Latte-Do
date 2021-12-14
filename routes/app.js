const express = require('express');
const router = express.Router();

const { loginUser } = require('../auth');

const db = require("../db/models");
const { csrfProtection, asyncHandler, handleValidationErrors } = require("../utils");

router.get('/', csrfProtection, asyncHandler(async (req, res) => {
    console.log(req.user, '--------------------')
    // const contacts = await db.Contact.findAll({
    //     where: {
    //         userId: req.user.userId
    //     }
    // })
    //console.log(contacts)
    res.render('index')
}))

module.exports = router;
