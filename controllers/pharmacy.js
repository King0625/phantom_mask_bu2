const { Op } = require("sequelize")
const { Pharmacy, OpenHour, Mask, sequelize } = require("../db/models")

module.exports = {
  listAllPharmacies: async (req, res) => {
    const { day, time } = req.query
    let whereClause = []
    if (day) {
      whereClause.push(`\`day\` = ${day}`)
    }

    if (time) {
      whereClause.push(`\`openAt\` <= ${time}`)
      whereClause.push(`\`closedAt\` >= ${time}`)
    }

    let whereSql = whereClause.length == 0 ? "" : `WHERE ${whereClause.join(" AND ")}`
    const pharmacies = await Pharmacy.findAll({
      where: {
        id: {
          [Op.in]: sequelize.literal(`(
            SELECT DISTINCT \`pharmacyId\`
            FROM \`OpenHours\`
            ${whereSql}
          )`)
        }
      },
      include: [
        {
          model: OpenHour,
        }
      ]
    })

    res.status(200).json({
      message: "success",
      data: pharmacies
    })
  },
  listAllMasksInAllPharmacies: async (req, res) => {
    const { count, priceAbove, priceBelow, countOption, threshold } = req.body
    let whereClause = {}
    switch (countOption) {
      case 1:
        whereClause.stockQuantity = {
          [Op.gte]: count
        }
        break
      case 2:
        whereClause.stockQuantity = {
          [Op.lte]: count
        }
        break
      case 3:
        const left = count - threshold
        const right = count + threshold
        whereClause.stockQuantity = {
          [Op.between]: [left, right]
        }
    }

    const pharmacies = await Pharmacy.findAll({
      include: {
        model: Mask,
        where: {
          price: {
            [Op.between]: [priceAbove, priceBelow]
          },
          ...whereClause
        },
        required: true
      }
    })
    res.status(200).json({
      message: "success",
      data: pharmacies
    })
  }
}