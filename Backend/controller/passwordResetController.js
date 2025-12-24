const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");

async function passwordResetController(req, res) {
    const { email, newPassword } = req.body;

    try {
        // ১. ইমেইল দিয়ে ইউজার খোঁজা
        const user = await userSchema.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // ২. নতুন পাসওয়ার্ড এনক্রিপ্ট (Hash) করা
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // ৩. পাসওয়ার্ড আপডেট করা এবং OTP মুছে ফেলা (যাতে একই OTP আবার ব্যবহার না হয়)
        await userSchema.findOneAndUpdate(
            { email: email },
            { 
                password: hashedPassword,
                otp: null, // কাজ শেষ, তাই OTP ডিলিট
                otpExpire: null
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Failed to reset password" });
    }
}

module.exports = passwordResetController;