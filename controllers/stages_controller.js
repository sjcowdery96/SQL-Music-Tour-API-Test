// DEPENDENCIES
const stages = require('express').Router()
/// creates db from the local library of models
const db = require('../models')
/// extracts the modules to construct from db
const { Stage, Event } = db
/// extracts the Op module from sequelize to use for operators
const { Op } = require('sequelize')

// FIND ALL STAGES
stages.get('/', async (req, res) => {
    try {
        ///this particular search string allows to find names that include query.name
        /// by leveraging the like operator
        const foundStages = await Stage.findAll({
            where: {
                stage_name: { [Op.like]: `%${req.query.stage_name ? req.query.stage_name : ''}%` }
            }
        })
        res.status(200).json(foundStages)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC STAGE
stages.get('/:name', async (req, res) => {
    try {
        /// returns a single stage based off their name that includes all the associated data of that stage
        const foundStage = await Stage.findOne({
            where: { stage_name: req.params.name },
            include: {
                model: Event,
                as: "events",
                through: { attributes: [] }
            },
            order: [
                [{ model: Event, as: "events" }, 'date', 'ASC'],
            ]
        })
        res.status(200).json(foundStage)
    } catch (error) {
        res.status(500).json(error)
    }
})

// CREATE A STAGE
stages.post('/', async (req, res) => {
    try {
        /// creates a stage based off the data in the request body
        const newStage = await Stage.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new stage',
            data: newStage
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

// UPDATE A STAGE
stages.put('/:id', async (req, res) => {
    try {
        /// uses the id in the url params to find the appropriate stage to update
        const updatedStages = await Stage.update(req.body, {
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedStages} stage(s)`
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

// DELETE A STAGE
stages.delete('/:id', async (req, res) => {
    try {
        /// uses the id in the url params to find the appropriate stage to delete
        const deletedStages = await Stage.destroy({
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedStages} stage(s)`
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

// EXPORT
module.exports = stages