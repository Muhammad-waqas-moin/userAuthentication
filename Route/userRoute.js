const express = require("express");
const { createUser } = require("../Controllar/userControllar");

const Router = express.Router();
Router.post("/createUser", createUser);
module.exports = Router;
