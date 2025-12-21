const emailValidation = require("../helpers/emailValidation");
const emailVerification = require("../helpers/emailVerification");
const userSchema = require("../model/userSchema");
const bcrypt = require('bcrypt');
const crypto = require("crypto")

function registrationController(req,res) {
    console.log(req.body);
    const {firstName,lastName,email,password} = req.body
    if(!firstName){
        return res.json("FirstName is Require")
    }
    if(!lastName){
        return res.json("LastName is Require")
    }
    if(!email){
        return res.json("Email is Require")
    }
    if(!emailValidation(email)){
        return res.json("Give Currect Email")
    }
    if(!password){
        return res.json("Password is Require")
    }
    const otp = crypto.randomInt(10000,99999).toString()
    
    const otpExpire = new Date(Date.now()+ 10 * 60 * 1000)
    console.log(otpExpire);
    

    bcrypt.hash(password, 10, function(err, hash) {
    const user = new userSchema({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash,
        otp: otp,
        otpExpire:otpExpire,
    })

     user.save()

     emailVerification(email,otp)

    res.status(201).json({
        message: "Registration Successfull",
        data: user
    })
    
    });

    
   
}

module.exports = registrationController