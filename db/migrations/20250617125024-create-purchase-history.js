'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PurchaseHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      maskName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pharmacyName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      transactionAmount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      transactionQuantity: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      transactionDatetime: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PurchaseHistories')
  }
}