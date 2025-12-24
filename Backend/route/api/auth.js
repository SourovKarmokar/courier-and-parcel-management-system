const express = require("express")
const registrationController = require("../../controller/registrationController")
const {otpController, resendOtpController} = require("../../controller/otpController")
const loginController = require("../../controller/loginController")
const {checkLogin} = require("../../middleware/authMiddleware")
const passwordResetController = require("../../controller/passwordResetController")

const router = express.Router()

router.post("/registration", registrationController)
router.post("/verifybyotp", otpController)
router.post("/resendotp",resendOtpController)
router.post("/login",loginController)
router.post("/changepassword", passwordResetController);

router.get("/test", checkLogin ,(req,res) => {
    res.json ({
            name: req.firstName,
            email: req.email,
            role: req.role,
            id: req.userid  
    })
})



module.exports = router