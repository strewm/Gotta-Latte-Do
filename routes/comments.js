const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const { Task, User, Comment, Contact } = db;


const validateComment =
    check('message')
    .exists({ checkFalsy: true })
    .withMessage('Must provide a comment in order to submit.')

router.get('/tasks/:id(\\d+)/comments', asyncHandler(async (req, res) => {
    const comments = await Comment.findAll({
        where: {
            taskId: req.params.id
        }
    })

    res.json({ comments })
}))

router.post(
    '/tasks/:id(\\d+)/comments',
    validateComment,
    handleValidationErrors,
    asyncHandler(async (req, res) => {
        const { message } = req.body;
        const userId = res.locals.userId;
        const taskId = req.params.id;
        const comment = await Comment.create({
            userId,
            taskId,
            message
        })
        res.status(201).json({ comment });
    }))

router.put(
    '/comments/:id(\\d+)',
    validateComment,
    handleValidationErrors,
    asyncHandler(async (req, res) => {
        const { message } = req.body;
        const comment = await Comment.findByPk(req.params.id);
        await comment.update({ message });
        res.json({ comment });
    }
))

router.delete(
    '/comments/:id(\\d+)',
    asyncHandler(async (req, res) => {
        const comment = await Comment.findByPk(req.params.id);
        await comment.destroy();
        res.status(204).end();
    })
)










module.exports = router
