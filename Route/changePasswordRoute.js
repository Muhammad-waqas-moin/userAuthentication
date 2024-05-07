const express = require("express");
const Router = express.Router();
const { changePassport } = require("../Controllar/changePasswordControllar");

Router.post("/changepassword", changePassport);

module.exports = Router;
