const otpGenerator = require('otp-generator')

const generateOTPCode = () => {
    return otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}


module.exports = {
    generateOTPCode
}