const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { Task, User } = db;


const validateTask = [
  check('description')
  .exists({checkFalsy: true})
  .withMessage('Must provide a description for task'),
  check('dueDate')
  .exists({checkFalsy: true})
  .withMessage('Must provide a due date for task')
  .isISO8601()
  .withMessage('Must provide a valid date')
]


router.get('/users/:id(\\d+)/tasks', csrfProtection, asyncHandler(async(req, res) => {
  const tasks = await Task.findAll({where: {userId: req.params.id}});
  res.json({tasks})
}))


router.post('/users/:id(\\d+)/tasks', validateTask, handleValidationErrors, csrfProtection, asyncHandler(async(req, res) => {
  const { description, dueDate, givenTo } = req.body;
  const userId = res.locals.userId
  const task = await Task.create({
    userId,
    description,
    dueDate,
    givenTo
  })
  res.status(201).json({task});
}))




module.exports = router;
