const router = require("express").Router()
const { searchForPharmaciesOrMasks } = require("../middlewares/validation")
const searchController = require("../controllers/search")

router.get("/",
  ...searchForPharmaciesOrMasks,
  searchController.searchForPharmaciesOrMasks
)

module.exports = router