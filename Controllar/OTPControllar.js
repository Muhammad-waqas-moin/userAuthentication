const OTP = require("../model/OTPSchema");
const User = require("../model/UserSchema");
const { successResponse, errorResponse } = require("../utils/helper");
exports.verifyOTP = async (req, res, next) => {
  try {
    console.log("hitting verify OTP route");
    const { email, otp, newPassword } = req.body;
    console.log(
      "email: " + email + " otp: " + otp + " new password: " + newPassword
    );
    const isOTPExist = await OTP.findOne({ email: email, otp: otp });
    if (!isOTPExist) {
      console.log("OTP not found");
      return errorResponse(res, "Incorrect OTP  OR Email", 404);
    }
    // set new password
    const user = await User.findOne({ email: email });
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    user.password = newPassword;
    await user.save();
    return successResponse(res, "OTP verify Successfully", 200, user);
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return errorResponse(res, err.message, 500);
  }
};
