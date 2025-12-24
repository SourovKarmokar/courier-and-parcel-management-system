const emailVerification = require("../helpers/emailVerification");
const userSchema = require("../model/userSchema");
const crypto = require("crypto");

async function otpController(req, res) {
  try {
    const { email, otp } = req.body;

    // ১. Input validation
    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP are required"
      });
    }

    // ২. User খুঁজুন
    const user = await userSchema.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    // ❌ আগে এখানে verified চেক ছিল, এখন সেটা বাদ দেওয়া হলো
    // কারণ Forgot Password এর সময় ইউজার Verified থাকে।

    // ৩. OTP আছে কিনা check
    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({
        error: "No OTP found. Please request a new OTP"
      });
    }

    // ৪. OTP expire check
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        error: "OTP has expired. Please request a new OTP"
      });
    }

    // ৫. OTP match check
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        error: "Invalid OTP"
      });
    }

    // ৬. User verify করুন (এবং OTP ক্লিয়ার করুন)
    // Forgot Password এর সময় Verified: true থাকলে সমস্যা নেই, আবার true সেট হবে।
    const userVerify = await userSchema.findOneAndUpdate(
      { email },
      {
        $set: { verified: true },
        $unset: { otp: "", otpExpire: "" } // কাজ শেষ, তাই OTP মুছে ফেলছি
      },
      {
        new: true,
        select: "-password"
      }
    );

    // ৭. Success response পাঠান
    return res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
      user: {
        email: userVerify.email,
        verified: userVerify.verified
      }
    });

  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    return res.status(500).json({
      error: "Server error. Please try again"
    });
  }
}

async function resendOtpController(req, res) {
  try {
    const { email } = req.body;

    // ১. Validation
    if (!email) {
      return res.status(400).json({
        error: "Email is required"
      });
    }

    // ২. User খুঁজুন
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found with this email"
      });
    }

    // ❌ সমস্যা ছিল এখানে! (Verified চেক বাদ দিয়েছি)
    // Forgot Password-এর জন্য Verified ইউজারেরও OTP দরকার হয়।

    // ৩. Generate new OTP (6 digit)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // ৪. Update user with new OTP
    await userSchema.findOneAndUpdate(
      { email },
      {
        $set: {
          otp: otp,
          otpExpire: otpExpire
        }
      },
      { new: true }
    );

    // ৫. Send email
    await emailVerification(email, otp);

    // ৬. Success response
    return res.status(200).json({
      success: true,
      message: "OTP has been sent to your email"
    });

  } catch (error) {
    console.error("❌ Resend OTP Error:", error);
    return res.status(500).json({
      error: "Failed to send OTP. Please try again"
    });
  }
}

module.exports = { otpController, resendOtpController };