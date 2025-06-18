const { Op, literal } = require("sequelize")
const { Pharmacy, Mask, OpenHour } = require("../db/models")

module.exports = {
  searchForPharmaciesOrMasks: async (req, res) => {
    const { q, type } = req.query

    let data = {
      masks: [],
      pharmacies: []
    }

    if (type == "mask" || type == "all") {
      const maskResults = await Mask.findAll({
        where: {
          name: { [Op.like]: `%${q}%` }
        },
        order: [
          [
            literal(`CASE
            WHEN Mask.name = '${q}' THEN 1
            WHEN Mask.name LIKE '${q}%' THEN 2
            WHEN Mask.name LIKE '%${q}%' THEN 3
            ELSE 4 END`), 'ASC'
          ]
        ],
        include: [Pharmacy]
      })
      data.masks.push(...maskResults)
    }

    if (type == "pharmacy" || type == "all") {
      const pharmacyResults = await Pharmacy.findAll({
        where: {
          name: { [Op.like]: `%${q}%` }
        },
        order: [
          [
            literal(`CASE
            WHEN Pharmacy.name = '${q}' THEN 1
            WHEN Pharmacy.name LIKE '${q}%' THEN 2
            WHEN Pharmacy.name LIKE '%${q}%' THEN 3
            ELSE 4 END`), 'ASC'
          ]
        ],
        include: [OpenHour]
      })
      data.pharmacies.push(...pharmacyResults)
    }

    res.status(200).json({
      message: "success",
      data
    })
  }
}