const emailValidation = require("../helpers/emailValidation")
const userSchema = require("../model/userSchema")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

async function loginController(req,res){
    const {email, password} = req.body

     if(!email){
        return res.json("Email is Require")
    }
    if(!emailValidation(email)){
        return res.json("Give Currect Email")
    }
    if(!password){
        return res.json("Password is Require")
    }

    const existingUser = await userSchema.findOne({email})
    if(!existingUser){
        return res.json({error: "This email is not registered"})
    }
    
    if(!existingUser.verified){
        return res.json({error:"This email is not verified"})
    }

    const isMatched = await bcrypt.compare(password, existingUser.password)
    
    const accessToken = jwt.sign(
        {
            userid: existingUser._id,
            firstName: existingUser.firstName,
            email: existingUser.email,
            role: existingUser.role,          
        },
        "api2406mern",
        {
            expiresIn: "1d"
        }
    )

    if(!isMatched){
        res.json({
            error: "Password is not matched"
        })
    } else {
       
        res.json({
            success: "Login successfully Done",
            accessToken: accessToken,
            user: {
                id: existingUser._id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                role: existingUser.role, 
            }
        })
    }   
}
module.exports = loginController