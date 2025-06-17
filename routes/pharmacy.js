const router = require("express").Router()
const { listAllPharmacies, listAllMasksInAllPharmacies, listAllMasksInOnePharmacy, upsertMasksForOnePharmacy } = require("../middlewares/validation")
const pharmacyController = require("../controllers/pharmacy")

router.get("/",
  ...listAllPharmacies,
  pharmacyController.listAllPharmacies
)

router.post("/filtered-by-mask-data",
  ...listAllMasksInAllPharmacies,
  pharmacyController.listAllMasksInAllPharmacies
)

router.get("/:pharmacyId/masks",
  ...listAllMasksInOnePharmacy,
  pharmacyController.listAllMasksInOnePharmacy
)

router.put("/:pharmacyId/masks/batch",
  ...upsertMasksForOnePharmacy,
  pharmacyController.upsertMasksForOnePharmacy
)

module.exports = router