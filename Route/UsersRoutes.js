const express = require("express");
const {
  createUser,
  login,
  forgetPassword,
  changePassport,
  getAllUsers,
} = require("../Controllar/UsersControllar");

const Router = express.Router();
// Routes
Router.get("/users", getAllUsers);
Router.post("/createUser", createUser);
Router.post("/forgetpassword", forgetPassword);
Router.post("/changepassword", changePassport);
Router.post("/login", login);
module.exports = Router;
