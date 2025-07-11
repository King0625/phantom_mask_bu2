'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OpenHour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OpenHour.belongsTo(models.Pharmacy)
    }
  }
  OpenHour.init({
    pharmacyId: DataTypes.INTEGER,
    day: DataTypes.INTEGER,
    openAt: DataTypes.INTEGER,
    closedAt: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OpenHour',
  })
  return OpenHour
}