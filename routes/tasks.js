const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { Task, User, TaskList, List } = db;


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


// Gets all of logged in user's tasks
router.get('/users/:id(\\d+)/tasks', csrfProtection, asyncHandler(async(req, res) => {
  const tasks = await Task.findAll({where: {userId: req.params.id}});
  res.json({tasks})
}))


// Create a new task for logged in user
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


// route to fetch user's tasks (all)
router.get('/', asyncHandler(async(req, res) => {
  const userId = res.locals.userId

  const tasks = await Task.findAll({
    where: {
      userId,
      givenTo: null,
    },
    order: [['createdAt']]
  })

  const user = await User.findByPk(userId);

  res.status(201).json({tasks, user});

}));


// route to fetch user's tasks that are incomplete
router.get('/incomplete', asyncHandler(async(req, res) => {
  const userId = res.locals.userId

  const tasks = await Task.findAll({
    where: {
      userId,
      givenTo: null,
      isCompleted: 'false'
    }
  })

  const user = await User.findByPk(userId);

  res.status(201).json({tasks, user});

}));


// route to fetch user's tasks that are completed
router.get('/complete', asyncHandler(async(req, res) => {
  const userId = res.locals.userId

  const tasks = await Task.findAll({
    where: {
      userId,
      givenTo: null,
      isCompleted: 'true'
    }
  })

  const user = await User.findByPk(userId);

  res.status(201).json({tasks, user});

}));


// route to fetch user's tasks that are assigned to user
router.get('/assigned', asyncHandler(async(req, res, next) => {
  const givenTo = res.locals.userId

try {
  const tasks = await Task.findAll({
     where: {
      givenTo
    },
    include: {model: User}
  })
  if (tasks) {

  res.status(201).json({tasks});
  }
} catch (e) {
  next(e)
}

}));

// Get a specific task
router.get('/task/:id(\\d+)', asyncHandler(async(req, res) => {
  const givenTo = parseInt(req.params.id, 10);
  const userId = res.locals.userId;

  if(givenTo === userId) {
    const tasks = await Task.findAll({
      where: {
        userId,
        givenTo: null
      }
    })
    const isContact = false;
    const user = await User.findByPk(userId)
    res.status(201).json({tasks, user, isContact});
  } else {
    const tasks = await Task.findAll({
      where: {
        userId,
        givenTo,
      }
    })
    const isContact = true;
    const user = await User.findByPk(givenTo)
    res.status(201).json({tasks, user, isContact});

  }

}));


// Create a new task for logged in user
router.post('/', validateTask, handleValidationErrors, asyncHandler(async(req, res) => {
  const { description, dueDate, isCompleted, givenTo, title } = req.body;
  const userId = res.locals.userId
  if(givenTo.length) {
    const contactId = await User.findAll({
      where: {
        username: givenTo
      }
    })

    const task = await Task.create({
      userId,
      description,
      dueDate,
      isCompleted,
      givenTo: contactId[0].id
    })



    res.status(201).json({task});
  } else {
    const task = await Task.create({
      userId,
      description,
      dueDate,
      isCompleted
    })

    const listInfo = await List.findOne({
      where: [{ title, userId }]
    })


    const taskId = task.id
    const listId = listInfo.id

    const taskList = await TaskList.create({
      taskId,
      listId
    })

    res.status(201).json({task, taskList});
  }

}));


// Get a specific task
router.get('/:id(\\d+)', asyncHandler(async(req, res, next) => {
  const task = await Task.findByPk(req.params.id);

  if (task) {
    res.json({ task });
  } else {
    next(taskNotFoundError(req.params.id));
  }
}))


// Edit a task
router.put ('/:id(\\d+)', validateTask, handleValidationErrors, asyncHandler(async(req, res, next) => {
  const { description, dueDate, isCompleted } = req.body;
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await task.update({
      description,
      dueDate,
      isCompleted
    })
    res.json({task});
  } else {
    next(taskNotFoundError(req.params.id));
  }
}))


// Delete a task
router.delete('/:id(\\d+)', asyncHandler(async(req, res, next) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await task.destroy()
    res.status(204).end()
  } else {
    next(taskNotFoundError(req.params.id))
  }
}))


// Edit a task's completed status
router.patch('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const { isCompleted } = req.body;
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await task.update({
      isCompleted
    })
    // task.isCompleted = isCompleted;
    res.json({ task });
  } else {
    next(taskNotFoundError(req.params.id));
  }
}))


module.exports = router;
