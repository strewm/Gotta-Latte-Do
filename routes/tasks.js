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

const taskNotFoundError = (id) => {
  const error = Error(`Task with id of ${id} could not be found`)
  error.title = 'Task not found'
  error.status = 404;
  return error;
}

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
}));

router.get('/tasks/:id(\\d+)', csrfProtection, asyncHandler(async(req, res, next) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    res.json({task});
  } else {
    next(taskNotFoundError(req.params.id));
  }
}))

router.put ('/tasks/:id(\\d+)', csrfProtection, validateTask, handleValidationErrors, asyncHandler(async(req, res, next) => {
  const { description, dueDate, givenTo } = req.body;
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await task.update({
      description,
      dueDate,
      givenTo
    })
    res.json({task});
  } else {
    next(taskNotFoundError(req.params.id));
  }
}))


router.delete('/tasks/:id(\\d+)', csrfProtection, asyncHandler(async(req, res, next) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await task.destroy()
    res.status(204).end()
  } else {
    next(taskNotFoundError(req.params.id))
  }
}))


module.exports = router;