const User = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const OTP = require("../model/OTPSchema");
const randomString = require("randomstring");

//create new user controllar
// check existing user
async function checkUserExistence(email, phonenumber) {
  try {
    console.log("Checking user existence for:", email, phonenumber);
    const isUserAlreadyRegistered = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phonenumber }],
    });
    if (isUserAlreadyRegistered) {
      console.log("User already exists:", isUserAlreadyRegistered);
      return true;
    }
    // console.log("User does not exist");
    return false;
  } catch (err) {
    console.log("Error in checking user existence:", err.message);
    throw err;
  }
}
exports.createUser = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    const isUser = await checkUserExistence(email, phoneNumber);
    if (isUser) {
      console.log("User already exists");
      return res.status(400).json({
        status: "failed",
        message: "User already exists",
      });
    }
    const result = await User.create(req.body);
    return res.status(200).json({
      status: "success",
      message: "User created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error creating user:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

///////////////////////////////////////////////////
//Login Controllar
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

//////////////////////////////////////////////////
//Forget Password
async function saveNewOTP(email) {
  const otp = randomString.generate({
    length: 6,
  });
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);

  // Find existing OTP
  let existingOTP = await OTP.findOne({ email: email });
  if (existingOTP) {
    // Update existing OTP
    existingOTP.otp = otp;
    existingOTP.expiresAt = expiry;
    return await existingOTP.save();
  } else {
    return await OTP.create({ email, otp, expiresAt: expiry });
  }
}

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    let isUser = await User.findOne({ email: email });
    if (!isUser) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    const existingOTP = await OTP.findOne({ email: email });
    if (existingOTP) {
      if (existingOTP.expiresAt > new Date()) {
        await OTP.deleteMany({ email });
      }
    }
    let otpObj = await saveNewOTP(email);
    isUser = await User.findOne({ email: email });
    return res.status(200).json({
      status: "success",
      message: "New OTP created successfully",
      data: { user: isUser, otp: otpObj },
    });
  } catch (err) {
    console.log("Error forgetting password:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

////////////////////////////////////////////////
//change password
async function checkUser(email) {
  try {
    let user = await User.findOne({ email });
    // console.log("old password", user.password);
    return user;
  } catch (err) {
    console.log("error fatching user:", err);
    throw err;
  }
}
exports.changePassport = async (req, res, next) => {
  try {
    const { newpassword, oldpassword, email } = req.body;
    console.log("receives:", newpassword, oldpassword, email);
    const user = await checkUser(email);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    const passwordMatches = await bcrypt.compare(oldpassword, user.password);
    if (!passwordMatches) {
      console.log("passwprd doest not match");
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid old password" });
    }
    console.log("passwprd doest  match");
    // const newHashPassowrd = await bcrypt.hash(newpassword, 10);
    // console.log("hashpassword", newHashPassowrd);
    user.password = newpassword;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "Password changes successfully",
      data: user,
    });
  } catch (err) {
    console.log("error changing password:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// async function checkUser(email) {
//   try {
//     const user = await User.findOne({ email });
//     return user;
//     // if (!user) {
//     //   return false;
//     // }
//     // return true;
//   } catch (err) {
//     console.log("error fatching user:", err);
//     throw err;
//   }
// }
// exports.changePassport = async (req, res, next) => {
//   try {
//     const { newPassword, email } = req.body;
//     console.log("changePassport hit : " + newPassword);
//     const user = await checkUser(email);
//     if (user) {
//       user.password = newPassword;
//       await user.save();
//       res.status(200).json({
//         status: "success",
//         data: user,
//       });
//     } else {
//       console.log("user not found");
//       return res.status(500).json({
//         status: "failed",
//         message: "user not found",
//       });
//     }
//   } catch (err) {
//     console.log("error changing password:", err);
//     return res.status(500).json({
//       status: "error",
//       message: "Internal server error",
//     });
//   }
// };

/////////////////////////////////////////////////
//get All users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (users.length) {
      return res.status(200).json({
        length: users.length,
        status: "success",
        data: users,
      });
    }
    return res.status(200).json({
      status: "success",
      message: "no user in database",
      data: users,
    });

    console.log("users======>", users);
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    console.log("error finding All Users:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
