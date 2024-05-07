const express = require("express");
const Router = express.Router();
const { forgetPassword } = require("../Controllar/ForgetPassControllar");

// Router.post("/changepassword", changePassport);
Router.post("/forgetpassword", forgetPassword);
module.exports = Router;
