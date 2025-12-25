const express = require("express")
const router = express.Router()
const authRouter = require("./auth")
const homeRouter = require("./home")
const parcelRouter = require("./parcel.js")
const adminRouter = require("./admin")
const agentRouter = require("./agent");
const customerRouter = require("./customer.js");


router.use("/authentication", authRouter)
router.use("/parcel", parcelRouter)
router.use("/admin" , adminRouter)
router.use("/agent", agentRouter);
router.use("/customer", customerRouter);


// router.use("/home",homeRouter)

module.exports = router