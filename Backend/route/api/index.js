const express = require("express")
const router = express.Router()
const authRouter = require("./auth")
const homeRouter = require("./home")
const parcelRouter = require("./parcel.js")

router.use("/authentication", authRouter)
router.use("/parcel", parcelRouter)
// router.use("/home",homeRouter)

module.exports = router