const OTP = require("../model/OTPSchema");
exports.verifyOTP = async (req, res, next) => {
  try {
    console.log("hitting verify OTP route");
    const { email, otp } = req.body;
    console.log("email: " + email + " otp: " + otp);
    const isOTPExist = await OTP.findOne({ email: email, otp: otp });

    if (!isOTPExist) {
      console.log("OTP not found");
      return res.status(404).json({
        status: "failed",
        message: "OTP or Email Not Found",
      });
    }

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
