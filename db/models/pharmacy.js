'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Pharmacy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pharmacy.hasMany(models.OpenHour)
      Pharmacy.hasMany(models.Mask)
    }
  }
  Pharmacy.init({
    name: DataTypes.STRING,
    cashBalance: DataTypes.Float
  }, {
    sequelize,
    modelName: 'Pharmacy',
  })
  return Pharmacy
}