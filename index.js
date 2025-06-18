const http = require("http")
const process = require("process")
const app = require("express")()
const bodyParser = require("body-parser")
const logger = require("morgan")
const cors = require("cors")

const pharmacyRouter = require("./routes/pharmacy")
const maskRouter = require("./routes/mask")
const userRouter = require("./routes/user")

const port = process.env.PORT | 11451

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger("[:date[iso]] :method :url :status :res[content-length] - :response-time ms"))

app.use("/pharmacies", pharmacyRouter)
app.use("/masks", maskRouter)
app.use("/users", userRouter)

const server = http.createServer(app)
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
