'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OpenHours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pharmacyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Pharmacies',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      day: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      openAt: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      closedAt: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OpenHours')
  }
}