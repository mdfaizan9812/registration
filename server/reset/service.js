const Reset = require('../reset/model');

const isOTPExist = async (otp) => {
    return await Reset.findOne({ otp });
}

const createOTP = async (email, otp) => {
    return await Reset.create({ email, code: otp });
}


module.exports = {
    isOTPExist,
    createOTP
}