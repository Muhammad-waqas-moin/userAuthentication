const express = require("express");
const { login } = require("../Controllar/loginControllar");
const Router = express.Router();

Router.post("/login", login);

module.exports = Router;
