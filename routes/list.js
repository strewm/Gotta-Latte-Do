const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const app = require('../app');
const db = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { Contact, User, List } = db;

const validateLists = [
    check('title')
      .exists({checkFalsy: true})
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
  router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
    const listId = req.params.id
    const listName = await List.findByPk(listId);
    res.status(200).json({listName});
  }))

  router.get('/new', csrfProtection, asyncHandler(async (req, res, next) => {
    if(!res.locals.userId) {
      res.redirect('/users/login')
    }
    res.render('add-list')
  }))

  router.get('/', asyncHandler(async (req, res) => {
    const userId = res.locals.userId;
    const allLists = await List.findAll({
      where: userId
    });
    res.status(200).json({allLists});
  }))


  router.post('/', validateLists, asyncHandler(async (req, res, next) => {
    const { createList } = req.body;
    const userId = res.locals.userId;

    try {
      if (createList.length >= 1) {
        const newList = await List.create({
        userId,
        title: createList
    })
  }
    res.status(201).json({newList})
    } catch (e) {
        next()
    }
}))
  router.patch('/:id(\\d+)', asyncHandler(async (req, res) => {
    const { title } = req.body;
    const list = await List.findByPk(req.params.id);
    await list.update({
      title
    })
    res.status(200).json({list});
  }))


  router.delete('/:id(\\d+)', asyncHandler(async (req, res) => {
    const list = await List.findByPk(req.params.id);
    if (list) {
      await list.destroy()
      res.status(204).end()
    } else {
      next(listNotFoundError(req.params.id))
    }
  }))

module.exports = router;
