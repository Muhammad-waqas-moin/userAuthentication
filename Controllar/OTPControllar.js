const OTP = require("../model/OTPSchema");
const User = require("../model/UserSchema");
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
      return res.status(404).json({
        status: "failed",
        message: "Incorrect OTP",
      });
    }
    // set new password
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "OTP verify Successfully",
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({
      status: "error",
      message: "Error verifying OTP",
    });
  }
};
