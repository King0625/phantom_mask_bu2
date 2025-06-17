const dayMapping = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thur: 4, Fri: 5, Sat: 6
}

module.exports = {
  parseOpenHours: (openHours) => {
    data = []

    openHours.forEach(openHour => {
      pieces = openHour.split(" ")
      day = dayMapping[pieces[0]]
      open = pieces[1]
      close = pieces[3]
      openHm = open.split(":")
      closeHm = close.split(":")

      if (open > close) {  // 跨日的話則分開成兩個 openHour 資料
        day1 = day
        openMinutes1 = parseInt(openHm[0]) * 60 + parseInt(openHm[1])
        closeMinutes1 = 24 * 60
        data.push({
          day: day1, openAt: openMinutes1, closedAt: closeMinutes1
        })
        day2 = (day + 1) % 7
        openMinutes2 = 0
        closeMinutes2 = parseInt(closeHm[0]) * 60 + parseInt(closeHm[1])
        data.push({
          day: day2, openAt: openMinutes2, closedAt: closeMinutes2
        })
      } else {
        openMinutes = parseInt(openHm[0]) * 60 + parseInt(openHm[1])
        closeMinutes = parseInt(closeHm[0]) * 60 + parseInt(closeHm[1])
        data.push({
          day: day, openAt: openMinutes, closedAt: closeMinutes
        })
      }
    })

    return data
  },
  insertIntoDb: async (model, data, isBulk = false) => {
    if (isBulk) {
      await model.bulkCreate(data)
    } else {
      insertResult = await model.create(data)
      return insertResult
    }
  }
}