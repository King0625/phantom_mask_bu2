const { query, validationResult, body, param } = require('express-validator')
const dayjs = require("dayjs")

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
  ],
  listAllMasksInOnePharmacy: [
    param("pharmacyId").notEmpty().withMessage("`phramacyId` must be provided")
      .isInt().withMessage("`pharmacyId` must be an integer"),
    query("sortByName").optional()
      .isInt({ min: 0, max: 1 }).withMessage("`sortByName` must be 0 or 1"),
    query("sortByPrice").optional()
      .isInt({ min: 0, max: 1 }).withMessage("`sortByPrice` must be 0 or 1"),
    checker
  ],
  upsertMasksForOnePharmacy: [
    param("pharmacyId").notEmpty().withMessage("`phramacyId` must be provided")
      .isInt().withMessage("`pharmacyId` must be an integer"),
    body("items").isArray({ min: 1, max: 100000 }).withMessage("`items` must be an array with length between 1 and 100000"),
    body("items.*.id").optional()
      .isInt().withMessage("`items.*.id` must be an integer"),
    body("items.*.name").notEmpty().withMessage("`items.*.name` must be provided")
      .isString().withMessage("`items.*.name` must be a string"),
    body("items.*.price").notEmpty().withMessage("`items.*.price` must be provided")
      .isFloat({ min: 0.0, max: 100000.0 }).withMessage("`item.*.price` must be a float within 0.0 ~ 100000.0"),
    body("items.*.stockQuantity").notEmpty().withMessage("`items.*.stockQuantity` must be provided")
      .isInt({ min: 0, max: 100000 }).withMessage("`items.*.stockQuantity` must be an integer within 0 ~ 100000"),
    checker
  ],
  updateExistingMask: [
    param("maskId").notEmpty().withMessage("`maskId` must be provided")
      .isInt().withMessage("`maskId` must be an integer"),
    body("quantity").notEmpty().withMessage("`quantity` must be provided")
      .isInt({ min: 0, max: 100000 }).withMessage("`quantity` must be an integer within 0 ~ 100000"),
    body("isIncrease").notEmpty().withMessage("`isIncrease` must be provided")
      .isInt({ min: 0, max: 1 }).withMessage("`isIncrease must be 0 or 1`"),
    checker
  ],
  showTheTopUsersWithinDatetime: [
    query("limit").notEmpty().withMessage("`limit` should be provided")
      .isInt({ min: 1, max: 100000 }).withMessage("`limit` must be an integer within 1 and 100000"),
    query("from").notEmpty().withMessage("`from` should be provided")
      .custom(from => {
        if (!dayjs(from, 'YYYY-MM-DD', true).isValid()) {
          throw new Error('`from` must be in YYYY-MM-DD format')
        }
        return true
      }),
    query("to").notEmpty().withMessage("`to` should be provided")
      .custom(to => {
        if (!dayjs(to, 'YYYY-MM-DD', true).isValid()) {
          throw new Error('`to` must be in YYYY-MM-DD format')
        }
        return true
      }),
    query("from").custom((from, { req }) => {
      const { to } = req.query
      if (Date.parse(from) > Date.parse(to)) {
        throw new Error("`from` should be earlier than `to`")
      }
      return true
    }),
    checker
  ],
  userPurchaseAtOnce: [
    body("username").notEmpty().withMessage("`username` must be provided")
      .isString().withMessage("`username` must be a string"),
    body("items").isArray({ min: 1, max: 100000 }).withMessage("`items` must be an array with length between 1 and 100000"),
    body("items.*.pharmacyId").notEmpty().withMessage("`items.*.pharmacyId` should not be empty")
      .isInt().withMessage("`items.*.pharmacyId` should be an integer"),
    body("items.*.maskId").notEmpty().withMessage("`items.*.maskId` should not be empty")
      .isInt().withMessage("`items.*.maskId` should be an integer"),
    body("items.*.transactionQuantity").notEmpty().withMessage("`items.*.transactionQuantity` should not be empty")
      .isInt({ min: 1, max: 100000 }).withMessage("`items.*.transactionQuantity` should be an integer within 1 ~ 100000"),
    checker
  ],
  searchForPharmaciesOrMasks: [
    query("q").notEmpty().withMessage("`q` must be provided")
      .isString().withMessage("`q` must be a string"),
    query("type").notEmpty().withMessage("`type` must be provided")
      .isIn(["mask", "pharmacy", "all"]).withMessage("`type` should be 'mask', 'pharmacy', or 'all'"),
    checker
  ]
}