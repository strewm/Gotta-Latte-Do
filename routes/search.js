const { Op, Sequelize } = require('sequelize');
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('../utils');
const { Task, TaskList, List } = db;

router.get('/:id', asyncHandler(async (req, res, next) => {
    const searchQuery = req.params.id;
    const firstThree = searchQuery.slice(0, 3);
    const firstThreeUp = firstThree.charAt(0).toUpperCase() + firstThree.slice(1);
    const lastThree = searchQuery.slice(-3);

    const userId = res.locals.userId;
    try{
        const resultsUncat = await Task.findAll({
            where: {
                userId,
                [Op.or]: [
                    {description: { [Op.substring]: `${searchQuery}`}},
                    {description: { [Op.substring]: `${firstThree}`}},
                    {description: { [Op.substring]: `${lastThree}`}},
                    {description: { [Op.substring]: `${firstThreeUp}`}},
                    {description: { [Op.iLike]: `${firstThree}`}},
                    {description: { [Op.iLike]: `${lastThree}`}},
                ]

            },
            include: {
                model: List,
            }
        })

        const results = await TaskList.findAll({
            include: [{
                model: Task,
                //through: {
                    where: {
                        userId,
                        [Op.or]: [
                            {description: { [Op.substring]: `${searchQuery}`}},
                            {description: { [Op.substring]: `${firstThree}`}},
                            {description: { [Op.substring]: `${lastThree}`}},
                            {description: { [Op.substring]: `${firstThreeUp}`}},
                            {description: { [Op.iLike]: `${firstThree}`}},
                            {description: { [Op.iLike]: `${lastThree}`}},
                        ]

                    }
                //}
            }, List]
        })

        res.status(201).json({results, resultsUncat})

    } catch (e) {
        next(e)
    }



}))

module.exports = router;
