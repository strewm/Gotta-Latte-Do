const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { Task, User, List } = db;

const validateLists = [
  check('title')
    .exists({checkFalsy: true})
    .withMessage('Please provide a title for this list')
    .isLength({ max: 50 })
    .withMessage('List name must not be more than 50 characters')
]

const listNotFoundError = (id) => {
  const error = Error(`Task with id of ${id} could not be found`)
  error.title = 'Task not found'
  error.status = 404;
  return error;
}

router.get('/', asyncHandler(async (req, res) => {
  const userId = res.locals.userId
  const lists = await List.findAll({where: {userId}})
  res.status(201).json({lists});
}))

router.post('/', validateLists, handleValidationErrors, asyncHandler(async(req, res) => {
  const { title } = req.body;
  const userId = res.locals.userId
  const list = await List.create({
    userId,
    title
  })
  res.status(201).json({list});
}))


router.get('/:id(\\d+)', csrfProtection, asyncHandler(async(req, res, next) => {
  const list = await List.findByPk(req.params.id);
    if (list) {
      res.json({list})
    } else {
      next(listNotFoundError(req.params.id));
    }
}))

router.put('/:id(\\d+)', csrfProtection, validateLists, handleValidationErrors, asyncHandler(async(req, res, next) => {
  const { title } = req.body;
  const list = await List.findByPk(req.params.id);
  if (list) {
    await list.update({
      title
    })
    res.json({list});
  } else {
    next(listNotFoundError(req.params.id));
  }
}))

router.delete('/lists/:id(\\d+)', csrfProtection, asyncHandler(async(req, res, next) => {
  const list = await List.findByPk(req.params.id);
  if (list) {
    await list.destroy()
    res.status(204).end()
  } else {
    next(listNotFoundError(req.params.id))
  }
}))



module.exports = router;
