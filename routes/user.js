const router = require("express").Router()
const { showTheTopUsersWithinDatetime, userPurchaseAtOnce } = require("../middlewares/validation")
const userController = require("../controllers/user")

router.get("/top-purchased",
  ...showTheTopUsersWithinDatetime,
  userController.showTheTopUsersWithinDatetime
)

router.post("/purchase-batch",
  ...userPurchaseAtOnce,
  userController.userPurchaseAtOnce
)

module.exports = router