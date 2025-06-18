const router = require("express").Router()
const { updateExistingMask } = require("../middlewares/validation")
const maskController = require("../controllers/mask")

router.patch("/:maskId/stock",
  ...updateExistingMask,
  maskController.updateExistingMask
)

module.exports = router