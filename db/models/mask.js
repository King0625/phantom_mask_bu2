'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Mask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mask.belongsTo(models.Pharmacy)
    }
  }
  Mask.init({
    pharmacyId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    stockQuantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Mask',
  })
  return Mask
}