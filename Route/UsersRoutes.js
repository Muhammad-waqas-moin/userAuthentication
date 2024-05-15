const express = require("express");
const {
  createUser,
  login,
  forgetPassword,
  changePassword,
  getAllUsers,
  getSingleUser,
  deleteUser,
} = require("../Controllar/UsersControllar");
const auth = require("../middlewares/auth");

const Router = express.Router();
// Routes
Router.get("/users", auth, getAllUsers);
Router.post("/createUser", createUser);
Router.post("/forgetpassword", auth, forgetPassword);
Router.post("/changepassword", auth, changePassword);
Router.post("/login", login);
Router.get("/user/:id", auth, getSingleUser);
Router.delete("/user/:id", auth, deleteUser);
module.exports = Router;
