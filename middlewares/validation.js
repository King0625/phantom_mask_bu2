const { query, validationResult, body } = require('express-validator')

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
    body("count")
      .notEmpty().withMessage("`count` should be provided")
      .isInt({ min: 0, max: 1000000 }).withMessage("`count` must be an integer within 0 ~ 1000000").toInt(),
    body("priceAbove").notEmpty().withMessage("`priceAbove` must be provided")
      .isFloat({ min: 0.0, max: 100000.0 }).withMessage("`priceAbove` must be a float within 0.0 ~ 100000.0").toFloat(),
    body("priceBelow").notEmpty().withMessage("`priceBelow` must be provided")
      .isFloat({ min: 0.0, max: 100000.0 }).withMessage("`priceBelow` must be a float within 0.0 ~ 100000.0").toFloat(),
    body("countOption").notEmpty().withMessage("`countOption` should be provided")
      .isInt({ min: 1, max: 3 }).withMessage("`countOption` must be an integer within 1 ~ 3"),
    body("threshold").optional()
      .isInt({ min: 0, max: 1000000 }).withMessage("`threshold must be an integer within 0 ~ 1000000`").toInt()
      .custom((threshold, { req }) => {
        const { count, countOption } = req.body
        if (countOption == 3 && (count - threshold < 0 || count + threshold > 1000000)) {
          throw new Error("(`count` - `threshold`) shouldn't be under 0 or (`count` + `threshold`) shouldn't be over 1000000")
        }
        return true
      }),
    body("priceAbove").custom((priceAbove, { req }) => {
      priceBelow = req.body.priceBelow
      if (priceBelow < priceAbove) {
        throw new Error("`priceAbove` should be lesser than `priceBelow`")
      }
      return true
    }),
    body("priceBelow").custom((priceBelow, { req }) => {
      priceAbove = req.body.priceAbove
      if (priceBelow < priceAbove) {
        throw new Error("`priceBelow` must be greater than `priceAbove")
      }
      return true
    }),
    body("countOption").custom((countOption, { req }) => {
      let { threshold } = req.body
      if (countOption == 3 && threshold == undefined) {
        throw new Error("`threshold` should be provided when `countOption` is 3")
      }
      return true
    }),
    checker
  ]
}