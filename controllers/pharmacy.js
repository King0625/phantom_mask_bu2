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
  },
  listAllMasksInOnePharmacy: async (req, res) => {
    let orders = []
    const { sortByPrice, sortByName } = req.query
    if (sortByPrice == 1) {
      orders.push([{ model: Mask }, "price", "ASC"])
    }
    if (sortByName == 1) {
      orders.push([{ model: Mask }, "name", "ASC"])
    }
    const orderClause = orders.length == 0 ? {} : { order: orders }

    const { pharmacyId } = req.params
    const pharmacy = await Pharmacy.findOne({
      where: {
        id: pharmacyId
      },
      include: [{
        model: Mask,
      }],
      ...orderClause
    })
    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacy id not found!"
      })
    }

    res.status(200).json({
      message: "success",
      data: pharmacy.Masks
    })
  },
  upsertMasksForOnePharmacy: async (req, res) => {
    const { pharmacyId } = req.params
    const pharmacy = await Pharmacy.findOne({
      where: {
        id: pharmacyId
      }
    })
    if (!pharmacy) {
      return res.status(404).json({
        message: "pharmacy id not found"
      })
    }

    const { items } = req.body
    const itemsWithPharmacyId = items.map(item => {
      item.pharmacyId = pharmacyId
      return item
    })

    const t = await sequelize.transaction()

    try {
      await Mask.bulkCreate(itemsWithPharmacyId, {
        updateOnDuplicate: ["id"],
        transaction: t
      })
      await t.commit()
    } catch (err) {
      await t.rollback()
      console.error('Rolled back due to error:', err)
      return res.status(500).json({
        message: "bulk upserting items failed!!"
      })
    }

    res.status(201).json({
      message: "items upserted successfully"
    })
  }
}