const express = require("express")
const registrationController = require("../../controller/registrationController")
const {otpController, resendOtpController} = require("../../controller/otpController")
const loginController = require("../../controller/loginController")
const router = express.Router()

router.post("/registration", registrationController)
router.post("/verifybyotp", otpController)
router.post("/resendotp",resendOtpController)
router.post("/login",loginController)


module.exports = router