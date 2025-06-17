'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PurchaseHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PurchaseHistory.belongsTo(models.User)
    }
  }
  PurchaseHistory.init({
    maskName: DataTypes.STRING,
    pharmacyName: DataTypes.STRING,
    transactionAmount: DataTypes.FLOAT,
    transactionQuantity: DataTypes.INTEGER,
    transactionDatetime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PurchaseHistory',
  })
  return PurchaseHistory
}