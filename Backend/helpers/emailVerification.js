const nodemailer = require("nodemailer");
async function emailVerification(email,otp){
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sourovkarmokar22@gmail.com",
    pass: "nrnjsnqpfunvwony",
  },
});


  const info = await transporter.sendMail({
    from: '"Courier" <sourovkarmokar22@gmail.com>',
    to: email,
    subject: "OTP Send",
    text: "Hello world?", 
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7fa; padding: 40px 0;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                      📦 Courier & Parcel
                    </h1>
                    <p style="color: #e9d5ff; margin: 10px 0 0 0; font-size: 14px;">
                      Secure Delivery Management System
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 50px 40px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                      Verify Your Email Address
                    </h2>
                    
                    <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                      Thank you for registering with Courier & Parcel Management System. Please use the following One-Time Password (OTP) to complete your verification:
                    </p>
                    
                    <!-- OTP Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; display: inline-block;">
                            <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">
                              Your OTP Code
                            </p>
                            <p style="color: #ffffff; margin: 0; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                              ${otp}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Important Notice -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <tr>
                        <td>
                          <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                            <strong>⚠️ Important:</strong> This OTP will expire in <strong>10 minutes</strong>. Do not share this code with anyone for security reasons.
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; margin: 30px 0 0 0; font-size: 14px; line-height: 1.6;">
                      If you didn't request this verification, please ignore this email or contact our support team immediately.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; margin: 0 0 15px 0; font-size: 13px; line-height: 1.6; text-align: center;">
                      This is an automated message, please do not reply to this email.
                    </p>
                    <p style="color: #9ca3af; margin: 0; font-size: 13px; text-align: center;">
                      © 2024 Courier & Parcel Management System. All rights reserved.
                    </p>
                    <p style="color: #9ca3af; margin: 15px 0 0 0; font-size: 12px; text-align: center;">
                      Need help? Contact us at <a href="mailto:support@courierparcel.com" style="color: #667eea; text-decoration: none;">support@courierparcel.com</a>
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  });

}
module.exports = emailVerification