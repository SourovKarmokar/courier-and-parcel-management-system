const express = require("express")
const router = express.Router()
const authRouter = require("./auth")

router.use("/authentication", authRouter)

module.exports = router