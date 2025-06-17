const { Op } = require("sequelize")
const { Pharmacy, OpenHour, sequelize } = require("../db/models")

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

    const pharmacies = await Pharmacy.findAll({
      where: {
        id: {
          [Op.in]: sequelize.literal(`(
            SELECT DISTINCT \`pharmacyId\`
            FROM \`OpenHours\`
            WHERE ${whereClause.join(" AND ")}
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
  }
}