const router = require("express").Router()
const { listAllPharmacies, listAllMasksInAllPharmacies } = require("../middlewares/validation")
const pharmacyController = require("../controllers/pharmacy")

router.get("/",
  ...listAllPharmacies,
  pharmacyController.listAllPharmacies
)

router.post("/filtered-by-mask-data",
  ...listAllMasksInAllPharmacies,
  pharmacyController.listAllMasksInAllPharmacies
)

module.exports = router