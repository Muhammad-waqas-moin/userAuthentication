const express = require("express");
const User = require("../model/UserSchema");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email: " + email + " password: " + password);

    // find user
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(404).json({
        status: "Not Found",
        message: "user not found",
      });
    }
    // compare password
    bcrypt.compare(password, isUser.password, (err, result) => {
      if (err) {
        console.log("Camparing password error  " + err);
        return res.status(500).json({
          status: "failed",
          messgae: "Internal Server Error",
        });
      }
      if (result) {
        console.log("login successful");
        return res.status(200).json({
          status: "success",
          message: "Login successful",
        });
      } else {
        console.log("login failed");
        return res.status(401).json({
          status: "failed",
          message: "incorrect password",
        });
      }
    });

    // res.send("login success");
  } catch (err) {
    consol.log("error finding user", err);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
