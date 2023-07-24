const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config()

const connectDB = require('./config/db')
const apiRouter = require('./routes')


const app = express()
connectDB()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
const PORT = process.env.PORT || 4000

app.use("/api", apiRouter)


app.get("/", (req, res) => {
    res.send("server is working")
})

app.listen(PORT, () => {
    console.log(`server was started on ${PORT}`)
})