const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { Contact, User, List, Task, TaskList } = db;
const { Op } = require('sequelize');

const validateLists = [
  check('title')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a title for this list')
    .isLength({ max: 50 })
    .withMessage('List name must not be more than 50 characters')
]

const listNotFoundError = (id) => {
  const error = Error(`List with id of ${id} could not be found`)
  error.title = 'List not found'
  error.status = 404;
  return error;
}


// Gets specific list
router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
  const listId = req.params.id
  const listName = await List.findByPk(listId);
  res.status(200).json({ listName });
}))

// Renders add list form
// router.get('/new', csrfProtection, asyncHandler(async (req, res, next) => {
//   if (!res.locals.userId) {
//     res.redirect('/users/login')
//   }
//   res.render('add-list')
// }))


// Gets all lists
router.get('/', asyncHandler(async (req, res) => {
  const userId = res.locals.userId;
  const allLists = await List.findAll({
    where: { userId }
  });
  res.status(200).json({ allLists });
}))


// Gets all tasks for a specific list
router.get('/:id(\\d+)/tasks', asyncHandler(async (req, res) => {
  const tasks = await TaskList.findAll({
    include: [{ model: Task }, { model: List }],
    where: { listId: req.params.id }
  })
  res.json({ tasks });
}))


// Creates a new list
router.post('/', csrfProtection, validateLists, asyncHandler(async (req, res, next) => {
  const { title } = req.body;
  const userId = res.locals.userId;

  try {
    if (title.length >= 1) {
      const newList = await List.create({
        userId,
        title
      })
      res.status(201).json({ newList })
    }
  } catch (e) {
    next(e)
  }
}))


// Edits a list
router.patch('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
  const { title } = req.body;
  const list = await List.findByPk(req.params.id);
  await list.update({
    title
  })
  res.status(200).json({ list });
}))


// Deletes a list
router.delete('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
  const list = await List.findByPk(req.params.id);
  if (list) {
    await list.destroy()
    res.status(204).end()
  } else {
    next(listNotFoundError(req.params.id))
  }
}))



// Gets all tasks that have been given to others
router.get('/given-to-others', asyncHandler(async (req, res, next) => {
  const userId = res.locals.userId;
  const tasks = await Task.findAll({
    where: {
      userId,
      givenTo: {
        [Op.ne]: null
      }
    },
    order: [['dueDate']]
  })
  res.json({ tasks })
}))


// Gets all tasks that have been given to the user
router.get('/given-to-me', asyncHandler(async (req, res) => {
  const userId = res.locals.userId;
  const tasksGivenToMe = await Task.findAll({
    where: {
      givenTo: userId
    },
    order: [['dueDate']]
  })
  res.json({ tasksGivenToMe })
}))


// Gets all tasks that have been given to the user and are incomplete
router.get('/given-to-me-incomplete', asyncHandler(async (req, res) => {
  const userId = res.locals.userId;
  const tasksGivenToMe = await Task.findAll({
    where: {
      givenTo: userId,
      isCompleted: 'false'
    },
    order: [['dueDate']]
  })
  res.json({ tasksGivenToMe })
}))

// Gets all tasks that have been given to the user and are complete
router.get('/given-to-me-complete', asyncHandler(async (req, res) => {
  const userId = res.locals.userId;
  const tasksGiven = await Task.findAll({
    where: {
      givenTo: userId,
      isCompleted: 'true'
    },
    order: [['dueDate']]
  })
  res.json({ tasksGiven })
}))

// Gets all tasks due today
router.get('/today', asyncHandler(async (req, res) => {
  const userId = res.locals.userId;
  const start = new Date().setHours(0, 0, 0, 0)
  const end = new Date().setHours(23, 59, 59, 999);
  const tasks = await Task.findAll({
    where: {
      userId,
      dueDate: {
        [Op.between]: [start, end]
      }
    },
    order: [['dueDate']]
  })
  res.json({ tasks });
}))


// Gets all tasks due tomorrow
router.get('/tomorrow', asyncHandler(async (req, res) => {
  const userId = res.locals.userId;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1)
  const start = tomorrow.setHours(0, 0, 0, 0);
  const end = tomorrow.setHours(23, 59, 59, 999);
  const tasks = await Task.findAll({
    where: {
      userId,
      dueDate: {
        [Op.between]: [start, end]
      }
    },
    order: [['dueDate']]
  })
  res.json({ tasks })
}))


// Gets all overdue tasks
router.get('/overdue', asyncHandler(async (req, res) => {
  const userId = res.locals.userId;
  const today = new Date().setHours(0, 0, 0, 0);
  const tasks = await Task.findAll({
    where: {
      [Op.and]: [{
        dueDate: { [Op.lt]: today }
      },
      { isCompleted: false },
      { userId }
      ],
    },
    order: [['dueDate']],
    include: [{ model: User }]
  })
  res.json({ tasks })
}))



module.exports = router;
