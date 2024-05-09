const express = require("express");
const Router = express.Router();
const { verifyOTP } = require("../Controllar/OTPControllar");

Router.post("/otp-verify", verifyOTP);

module.exports = Router;
