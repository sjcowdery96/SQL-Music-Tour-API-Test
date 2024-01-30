'use strict';

///sequelize is used to mediate between the SQL database and javascript
///it also will generate migration files for each model so data translates properly
const Sequelize = require('sequelize');
///the modules below link together the database pathing
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
///here sequelize is initialized based of our environmental variables (if we have them)
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
///fs is a file reading module that is used here in conjuction with
///path to link the model files to the database using a forEach loop
fs
  .readdirSync(__dirname)
  .filter(file => {
    ///returns files that match a specific format ending in ".js"
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
///adds corresponding database keys to the models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

///since our db was initialzed empty {} it now holds two instances
/// of sequelize with capitalization and non-capitalization for redundandcy
db.sequelize = sequelize;
db.Sequelize = Sequelize;


///exports the db
module.exports = db;
