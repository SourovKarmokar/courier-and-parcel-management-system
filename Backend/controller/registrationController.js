const emailValidation = require("../helpers/emailValidation");
const userSchema = require("../model/userSchema");
const bcrypt = require('bcrypt');

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

    bcrypt.hash(password, 10, function(err, hash) {
    const user = new userSchema({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash
    })

     user.save()

    res.status(201).json({
        message: "Registration Successfull",
        data: user
    })
    
    });

    
   
}

module.exports = registrationController