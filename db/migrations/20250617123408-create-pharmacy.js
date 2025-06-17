'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pharmacies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cashBalance: {
        allowNull: false,
        type: Sequelize.FLOAT
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pharmacies')
  }
}