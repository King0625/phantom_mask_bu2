const { query, validationResult, oneOf } = require('express-validator')

function checker(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

module.exports = {
  listAllPharmacies: [
    query("time").optional()
      .isInt({ min: 0, max: 1440 }).withMessage("`time` must be an integer within 0 ~ 1440(minutes)!"),
    query("day").optional()
      .isInt({ min: 0, max: 6 }).withMessage("`day` must be an integer within 0 ~ 6 (Sun ~ Sat) !"),
    checker
  ],
  listAllMasksInAllPharmacies: [
    oneOf([
      query("above").notEmpty(),
      query("below").notEmpty()
    ], {
      message: "At least `above` or `below` should be provided"
    }),
    query("above").optional()
      .isFloat({ min: 0.0, max: 100000.0 }).withMessage("`above` must be a float within 0.0 ~ 100000.0").toFloat(),
    query("below").optional()
      .isFloat({ min: 0.0, max: 100000.0 }).withMessage("`below` must be a float within 0.0 ~ 100000.0").toFloat(),
    query("above").custom((above, { req }) => {
      below = req.query.below
      if (below && below < above) {
        throw new Error("`above` should be lesser than `below`")
      }
      return true
    }),
    query("below").custom((below, { req }) => {
      above = req.query.above
      if (above && below < above) {
        throw new Error("`below` must be greater than `above")
      }
      return true
    }),
    checker
  ]
}