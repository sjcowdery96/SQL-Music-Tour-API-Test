// DEPENDENCIES
/// brings in the necessary node modules and packages required to run the app
const express = require('express')
const app = express()
///sequelize is used to mediate between the SQL database and javascript
///it also will generate migration files for each model so data translates properly
const { Sequelize } = require('sequelize')

///the controlerfile below is unnecessary as it is defined and used later
/// --> const bands = require('./controllers/bands_controller')

// CONFIGURATION / MIDDLEWARE
/// initializes our app to run express and configure our environmental varables
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ROOT
///this is the base of our app that will fire when the user first lands on the homepage
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Tour API'
    })
})

// CONTROLLERS  

///these controlers are used to control calls and responses to each of the corresponding data tables
const bandsController = require('./controllers/bands_controller')
app.use('/bands', bandsController)

const eventsController = require('./controllers/events_controller')
app.use('/events', eventsController)

const stagesController = require('./controllers/stages_controller')
app.use('/stages', stagesController)

// LISTEN

///finally we have the server listen on our port
app.listen(process.env.PORT, () => {
    console.log(`🎸 Rockin' on port: ${process.env.PORT}`)
})