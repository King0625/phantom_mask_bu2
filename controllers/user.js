const { Op, fn, literal } = require("sequelize")
const { User, PurchaseHistory } = require("../db/models")

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
  }
}