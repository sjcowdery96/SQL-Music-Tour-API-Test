'use strict'
const { DataTypes } = require('sequelize')
/// this migration covers the recommendation column
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bands', 'recommendation', {
      type: DataTypes.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bands', 'recommendation')
  }
}
