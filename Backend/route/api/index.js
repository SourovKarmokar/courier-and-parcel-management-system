const express = require("express")
const router = express.Router()
const authRouter = require("./auth")
const homeRouter = require("./home")
const parcelRouter = require("./parcel.js")
const adminRouter = require("./admin")
const agentRouter = require("./agent");

router.use("/authentication", authRouter)
router.use("/parcel", parcelRouter)
router.use("/admin" , adminRouter)
router.use("/agent", agentRouter);
// router.use("/home",homeRouter)

module.exports = router