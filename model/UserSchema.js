const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: [true, "email already exists"],
  },
  password: {
    type: String,
    minLength: [4, "password must be at least 4 characters"],
    required: [true, "Please enter your password"],
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please enter a valid phone number"],
    unique: true,
  },
  fullname: {
    type: String,
    required: [true, "Fullname is required"],
  },
  opt: {
    type: String,
    required: false, // making feild optional
  },
});
UserSchema.pre("save", async function () {
  if (!this.isModified) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
module.exports = mongoose.model("User", UserSchema);
