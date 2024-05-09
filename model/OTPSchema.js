const mongoose = require("mongoose");

const OTPSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
    // default: "",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("OTPSchema", OTPSchema);
