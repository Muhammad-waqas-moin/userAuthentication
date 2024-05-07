const express = require("express");
const User = require("../model/UserSchema");

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

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
  } catch (err) {
    console.log("error forgetting password:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
