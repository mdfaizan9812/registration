const Reset = require('../reset/model');

const isOTPExist = async (otp) => {
    return await Reset.findOne({ otp });
}

const createOTP = async (email, otp) => {
    const data = await Reset.updateOne({ email }, { code: otp });
    if (data.modifiedCount) {
        return { code: otp }
    }
    return await Reset.create({ email, code: otp });
}

const isMatchedOTP = async (email, otp) => {
    return await Reset.findOne({ email, code: otp });
}


module.exports = {
    isOTPExist,
    createOTP,
    isMatchedOTP
}