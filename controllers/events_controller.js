// DEPENDENCIES
const events = require('express').Router()
/// creates db from the local library of models
const db = require('../models')
/// extracts the modules to construct from db
const { Event, MeetGreet, SetTime, Stage, Band } = db
/// extracts the Op module from sequelize to use for operators
const { Op } = require('sequelize')

// FIND ALL EVENTS
events.get('/', async (req, res) => {
    try {
        const foundEvents = await Event.findAll({
            order: [['date', 'ASC']],
            where: {
                ///this particular search string allows to find names that include query.name
                /// by leveraging the like operator
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            }
        })
        res.status(200).json(foundEvents)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC EVENT
events.get('/:name', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            /// returns a single event based off their name that includes all the associated data of that event
            where: { name: req.params.name },
            include: [
                {
                    model: MeetGreet,
                    as: "meet_greets",
                    attributes: { exclude: ["event_id", "band_id"] },
                    include: {
                        model: Band,
                        as: "band",
                    }
                },
                {
                    model: SetTime,
                    as: "set_times",
                    attributes: { exclude: ["event_id", "stage_id", "band_id"] },
                    include: [
                        { model: Band, as: "band" },
                        { model: Stage, as: "stage" }
                    ]
                },
                {
                    model: Stage,
                    as: "stages",
                    through: { attributes: [] }
                }
            ]
        })
        res.status(200).json(foundEvent)
    } catch (error) {
        res.status(500).json(error)
    }
})

// CREATE AN EVENT
events.post('/', async (req, res) => {
    try {
        /// creates an event based off the data in the request body
        const newEvent = await Event.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new event',
            data: newEvent
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

// UPDATE AN EVENT
events.put('/:id', async (req, res) => {
    try {
        /// uses the id in the url params to find the appropriate event to update
        const updatedEvents = await Event.update(req.body, {
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedEvents} event(s)`
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

// DELETE AN EVENT
events.delete('/:id', async (req, res) => {
    try {
        /// uses the id in the url params to find the appropriate event to delete
        const deletedEvents = await Event.destroy({
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedEvents} event(s)`
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

// EXPORT
module.exports = events