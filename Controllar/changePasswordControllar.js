const express = require("express");
const User = require("../model/UserSchema");

async function checkUser(email) {
  try {
    const user = await User.findOne({ email });
    return user;
    // if (!user) {
    //   return false;
    // }
    // return true;
  } catch (err) {
    console.log("error fatching user:", err);
    throw err;
  }
}

exports.changePassport = async (req, res, next) => {
  try {
    const { newPassword, email } = req.body;
    console.log("changePassport hit with params: " + newPassword);
    const user = await checkUser(email);
    if (user) {
      user.password = newPassword;
      await user.save();
      res.status(200).json({
        status: "success",
        data: user,
      });
    } else {
      console.log("user not found");
      return res.status(500).json({
        status: "failed",
        message: "user not found",
      });
    }
  } catch (err) {
    console.log("erroe changing password:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
