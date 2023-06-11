const { sendOtpCodeTemplate } = require("./mailTemplates");
const { MAILCODE } = require("../../constant")
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
})

const sendMail = async (data) => {
    try {
        let html;
        let subject;
        if (data.code === MAILCODE.REGISTRATION) {
            html = sendOtpCodeTemplate(data.username, data.OTP);
            subject = "Registration OTP - Complete your moneymate registration";
        }

        const mailOptions = {
            from: process.env.SMTP_USERNAME,
            to: data.email,
            subject: subject,
            html: html
        };
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log(error);
    }
};

module.exports = { sendMail };
