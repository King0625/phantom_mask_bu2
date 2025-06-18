const { Op, fn, literal } = require("sequelize")
const { User, PurchaseHistory, Pharmacy, OpenHour, Mask, sequelize } = require("../db/models")
const dayjs = require("dayjs")
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = {
  showTheTopUsersWithinDatetime: async (req, res) => {
    const { limit, from, to } = req.query
    const topUsers = await PurchaseHistory.findAll({
      attributes: [
        [fn('SUM', literal('transactionAmount * transactionQuantity')), 'totalSpent']
      ],
      where: {
        transactionDatetime: {
          [Op.between]: [new Date(from), new Date(to)]
        }
      },
      group: ['User.id', 'User.name'],
      order: [[literal('totalSpent'), 'DESC']],
      limit: parseInt(limit),
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ]
    })

    res.status(200).json({
      message: "success",
      data: topUsers
    })
  },
  userPurchaseAtOnce: async (req, res) => {
    const { username, items } = req.body
    const user = await User.findOne({
      where: {
        name: username
      }
    })

    if (!user) {
      return res.status(404).json({
        message: "username not found"
      })
    }

    const currentDate = {
      datetime: dayjs(),
      day: dayjs().day(),
      minutes: dayjs().tz('Asia/Taipei').hour() * 60 + dayjs().minute()
    }
    const t = await sequelize.transaction()
    try {
      for (const item of items) {
        const pharmacy = await Pharmacy.findOne({
          where: {
            id: item.pharmacyId
          },
          include: [
            {
              model: OpenHour,
              where: {
                day: currentDate.day,
                openAt: {
                  [Op.lte]: currentDate.minutes
                },
                closedAt: {
                  [Op.gte]: currentDate.minutes
                }
              },
              required: true,
              attributes: [] // Don't include task fields in result
            }
          ]
        }, { transaction: t })

        if (!pharmacy) {
          await t.rollback()
          return res.status(400).json({
            message: "one of the pharmacies is closed or pharmacyId not found"
          })
        }

        const mask = await Mask.findOne({
          where: {
            id: item.maskId,
            pharmacyId: item.pharmacyId,
            stockQuantity: {
              [Op.gte]: item.transactionQuantity
            }
          }
        }, { transaction: t })

        if (!mask) {
          await t.rollback()
          return res.status(400).json({
            message: "mask not found or not sufficent quantity to purchase"
          })
        }
        mask.stockQuantity = mask.stockQuantity - item.transactionQuantity
        await mask.save({ transaction: t })

        const moneySpent = mask.price * item.transactionQuantity
        if (user.cashBalance < moneySpent) {
          await t.rollback()
          return res.status(400).json({
            message: "not enough money for user"
          })
        }
        user.cashBalance = user.cashBalance - moneySpent
        await user.save({ transaction: t })
        pharmacy.cashBalance = pharmacy.cashBalance + moneySpent
        await pharmacy.save({ transaction: t })

        await PurchaseHistory.create({
          userId: user.id,
          maskName: mask.name,
          pharmacyName: pharmacy.name,
          transactionAmount: mask.price,
          transactionQuantity: item.transactionQuantity,
          transactionDatetime: currentDate.datetime
        }, { transaction: t })
      }

      await t.commit()
    } catch (err) {
      await t.rollback()
      console.error('Rolled back due to error:', err)
      return res.status(500).json({
        message: "bulk upserting items failed!!"
      })
    }

    res.status(201).json({
      message: "Purchase all required masks successfully"
    })
  }
}