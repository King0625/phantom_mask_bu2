const { Mask } = require("../db/models")

module.exports = {
  updateExistingMask: async (req, res) => {
    const { maskId } = req.params
    const mask = await Mask.findOne({
      where: {
        id: maskId
      }
    })

    if (!mask) {
      return res.status(404).json({
        message: "mask id not found"
      })
    }

    const { quantity, isIncrease } = req.body
    let currentQuantity = mask.dataValues.stockQuantity
    if (isIncrease == 1) {
      currentQuantity += parseInt(quantity)
    } else {
      currentQuantity -= parseInt(quantity)
    }

    if (currentQuantity < 0) {
      return res.status(400).json({
        message: "the mask quantity is under 0 after operation"
      })
    }
    mask.stockQuantity = currentQuantity
    await mask.save()

    res.status(200).json({
      message: "update mask quantity successfully"
    })
  }
}