const fs = require("fs")
const path = require("path")
const { parseOpenHours, insertIntoDb } = require("../utils/helper")

const pharmacyJsonPath = path.join(__dirname, "../data/pharmacies.json")
const userJsonPath = path.join(__dirname, "../data/users.json")
const { Pharmacy, OpenHour, Mask, User, PurchaseHistory } = require("./models")

jsonParse()

async function jsonParse() {
  console.log("Start inserting pharmacies.json data:")
  console.log("Models involved: Pharmacy, OpenHour, Mask\n")
  console.log("Start parsing JSON...")
  pharmacyJsonData = JSON.parse(fs.readFileSync(pharmacyJsonPath))
  console.log("JSON parsed successfully!\n")

  console.log("Start inserting parsed data into DB...")
  for (pharmacy of pharmacyJsonData) {
    pharmacyData = {
      name: pharmacy.name,
      cashBalance: pharmacy.cashBalance
    }
    pharmacyDbData = await insertIntoDb(Pharmacy, pharmacyData)
    pharmacyId = pharmacyDbData.dataValues.id

    openHoursRaw = pharmacy.openingHours
    openHours = openHoursRaw.split(", ")
    openHourData = parseOpenHours(openHours)
    openHourDataWithPharmacyId = openHourData.map(data => {
      data.pharmacyId = pharmacyId
      return data
    })
    await insertIntoDb(OpenHour, openHourDataWithPharmacyId, true)

    maskData = pharmacy.masks
    maskDataWithPharmacyId = maskData.map(data => {
      data.pharmacyId = pharmacyId
      return data
    })
    await insertIntoDb(Mask, maskDataWithPharmacyId, true)
  }
  console.log("Finish inserting all pharmacies.json data!!\n\n")

  console.log("Start inserting users.json data:")
  console.log("Models involved: User, PurchaseHistory\n")
  console.log("Start parsing JSON...")
  userJsonData = JSON.parse(fs.readFileSync(userJsonPath))
  console.log("JSON parsed successfully!\n")

  console.log("Start inserting parsed data into DB...")
  for (user of userJsonData) {
    userData = {
      name: user.name,
      cashBalance: user.cashBalance
    }

    userDbData = await insertIntoDb(User, userData)
    userId = userDbData.dataValues.id

    purchaseHistoryData = user.purchaseHistories
    purchasehistoryDataWithUserId = purchaseHistoryData.map(data => {
      data.userId = userId
      return data
    })

    await insertIntoDb(PurchaseHistory, purchasehistoryDataWithUserId, true)
  }
  console.log("Finish inserting all users.json data!!\n\n")
}