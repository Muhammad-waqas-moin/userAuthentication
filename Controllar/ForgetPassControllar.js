const express = require("express");
const User = require("../model/UserSchema");

// function generateOTP() {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   return otp.toString();
// }
const generateOTP = () => {
  const opt = Math.floor(100000 + Math.random() * 900000); // first 100000 is for range and last 900000 is for heighest possible range
  console.log("your opt ===> ", opt);
  return opt.toString();
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(404).json({
        status: "failed",
        message: "user not found",
      });
    }
    const opt = generateOTP();
    isUser.opt = opt;
    await isUser.save();
    return res.status(200).json({
      status: "success",
      data: isUser,
    });
  } catch (err) {
    console.log("error forgetting password:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
