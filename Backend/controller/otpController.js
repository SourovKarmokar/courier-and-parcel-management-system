const emailVerification = require("../helpers/emailVerification");
const userSchema = require("../model/userSchema");
const crypto = require("crypto")

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

    console.log("User:", user.email);
    console.log("Stored OTP:", user.otp, "Provided OTP:", otp);

    // ৩. Already verified check (return যোগ করুন!)
    if (user.verified) {
      return res.status(400).json({
        error: "This email is already verified"
      });
    }

    // ৪. OTP আছে কিনা check
    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({
        error: "No OTP found. Please request a new OTP"
      });
    }

    // ৫. OTP expire check
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        error: "OTP has expired. Please request a new OTP"
      });
    }

    // ৬. OTP match check (String এ convert করুন)
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        error: "Invalid OTP"
      });
    }

    // ৭. User verify করুন
    const userVerify = await userSchema.findOneAndUpdate(
      { email },
      {
        $set: { verified: true },
        $unset: { otp: "", otpExpire: "" }
      },
      {
        new: true,
        select: "-password" // password response এ পাঠাবেন না
      }
    );

    console.log("✅ User verified:", userVerify.email);

    // ৮. Success response পাঠান
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        email: userVerify.email,
        firstName: userVerify.firstName,
        lastName: userVerify.lastName,
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
    console.log("Resend OTP Request");
    const { email } = req.body;
    console.log("Email:", email);

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

    // ৩. Already verified check
    if (user.verified) {
      return res.status(400).json({
        error: "This email is already verified"
      });
    }

    // ৪. Generate new OTP (6 digit)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    console.log("Generated OTP:", otp);

    // ৫. Update user with new OTP (await করুন!)
    const updatedUser = await userSchema.findOneAndUpdate(
      { email },
      {
        $set: {
          otp: otp,
          otpExpire: otpExpire
        }
      },
      {
        new: true
      }
    );

    console.log("OTP updated for:", updatedUser.email);

    // ৬. Send email (await করুন!)
    await emailVerification(email, otp);

    console.log("✅ OTP email sent to:", email);

    // ৭. Success response
    return res.status(200).json({
      success: true,
      message: "OTP has been resent to your email"
    });

  } catch (error) {
    console.error("❌ Resend OTP Error:", error);
    return res.status(500).json({
      error: "Failed to resend OTP. Please try again"
    });
  }
}


module.exports = {otpController ,resendOtpController};