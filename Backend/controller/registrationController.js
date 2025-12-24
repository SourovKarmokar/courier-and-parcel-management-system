const emailValidation = require("../helpers/emailValidation");
const emailVerification = require("../helpers/emailVerification");
const userSchema = require("../model/userSchema");
const bcrypt = require('bcrypt');
const crypto = require("crypto");

function registrationController(req, res) {
    const { firstName, lastName, email, password, role, phone } = req.body;

    // ১. ভ্যালিডেশন (Validation)
    if (!firstName) return res.json({ error: "FirstName is Required" });
    if (!lastName) return res.json({ error: "LastName is Required" });
    if (!email) return res.json({ error: "Email is Required" });
    if (!emailValidation(email)) return res.json({ error: "Give Correct Email" });
    if (!password) return res.json({ error: "Password is Required" });
    if (!phone) return res.json({ error: "Phone is Required" });

    // ২. ৬ ডিজিটের OTP তৈরি (Standard)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // ১০ মিনিট মেয়াদ

    // ৩. পাসওয়ার্ড এনক্রিপশন
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) return res.status(500).json({ error: "Encryption Error" });

        const user = new userSchema({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
            // 👇 এটাই আসল ফিক্স: "user" এর বদলে "customer"
            role: role || "customer", 
            otp: otp,
            otpExpire: otpExpire,
            phone: phone,
        });

        // ৪. ডাটাবেসে সেভ করা এবং ইমেইল পাঠানো
        user.save()
            .then(() => {
                // ডাটাবেসে সেভ হওয়ার পরেই কেবল ইমেইল যাবে
                emailVerification(email, otp);
                
                res.status(201).json({
                    message: "Registration Successfull",
                    data: user
                });
            })
            .catch((error) => {
                console.log("Registration Error:", error.message);
                
                // যদি ইমেইল আগে থেকেই থাকে
                if (error.code === 11000) {
                    return res.json({ error: "Email already exists" });
                }
                
                // অন্যান্য এরর
                res.status(500).json({ 
                    error: "Registration Failed", 
                    details: error.message 
                });
            });
    });
}

module.exports = registrationController;