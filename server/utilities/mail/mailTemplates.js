const sendOtpCodeTemplate = (username, OTP) => {
  return `<!DOCTYPE html>
    <html>
    
    <head>
      <meta charset="UTF-8">
      <title>Registration OTP</title>
      <style>
        h2 {
          color: #333333;
          font-size: 24px;
          font-weight: bold;
        }
    
        h3 {
          color: #007bff;
          font-size: 20px;
        }
    
        p {
          color: #555555;
          font-size: 16px;
        }
      </style>
    </head>
    
    <body>
      <h2>Registration OTP</h2>
      <p>Dear ${username},</p>
      <p>Thank you for registering with our service. To complete the registration process, please use the following One-Time Password (OTP):</p>
      <h3>${OTP}</h3>
      <p style="font-weight: bold;">This OTP is valid for 10 minutes only. Please ensure to complete the registration process within this time frame.</p>
      <p>This OTP should not be shared with anyone. If you didn't initiate the registration process, please ignore this email.</p>
      <p>Thank you,</p>
      <p>The Moneymate Team</p>
    </body>
    
    </html>
    
    `
}

module.exports = {
  sendOtpCodeTemplate
}