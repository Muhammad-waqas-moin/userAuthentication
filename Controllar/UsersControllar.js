const User = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const OTP = require("../model/OTPSchema");
const randomString = require("randomstring");
const jwt = require("jsonwebtoken");

const { successResponse, errorResponse } = require("../utils/helper");

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
      return errorResponse(res, "User already exists", 400);
      // return res.status(400).json({
      //   status: "failed",
      //   message: "User already exists",
      // });
    }
    const result = await User.create(req.body);
    // return res.status(200).json({
    //   status: "success",
    //   message: "User created successfully",
    //   data: result,
    // });
    return successResponse(res, "User created successfully", 200, result);
  } catch (err) {
    console.error("Error creating user:", err.message);
    return errorResponse(res, err.message, 500);
    // return res.status(500).json({
    //   status: "error",
    //   message: "Internal server error",
    // });
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
      return errorResponse(res, "User Not Found", 404);
    }
    // compare password
    bcrypt.compare(password, isUser.password, (err, result) => {
      if (err) {
        console.log("Camparing password error  " + err);
        return errorResponse(res, err.message, 500);
      }
      if (result) {
        console.log("login successful");
        const token = jwt.sign({ id: isUser._id }, process.env.SECRATKEY, {
          expiresIn: "1h",
        });
        return successResponse(res, "Login successful", 200, {
          user: isUser,
          token: token,
        });
        // return res.status(200).json({
        //   status: "success",
        //   message: "Login successful",
        // });
      } else {
        console.log("login failed");
        return errorResponse(res, "Incorrect Password", 401);
      }
    });

    // res.send("login success");
  } catch (err) {
    consol.log("error finding user", err);
    return errorResponse(res, err.message, 500);
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
      return errorResponse(res, "User not found", 404);
    }
    const existingOTP = await OTP.findOne({ email: email });
    if (existingOTP) {
      if (existingOTP.expiresAt > new Date()) {
        await OTP.deleteMany({ email });
      }
    }
    let otpObj = await saveNewOTP(email);
    isUser = await User.findOne({ email: email });
    return successResponse(res, "New OTP created successfully", 200, {
      user: isUser,
      otp: otpObj,
    });
    // return res.status(200).json({
    //   status: "success",
    //   message: "New OTP created successfully",
    //   data: { user: isUser, otp: otpObj },
    // });
  } catch (err) {
    console.log("Error forgetting password:", err);
    return errorResponse(res, err.message, 500);
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
exports.changePassword = async (req, res, next) => {
  try {
    const { newpassword, oldpassword, email } = req.body;
    console.log("receives:", newpassword, oldpassword, email);
    const user = await checkUser(email);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    const passwordMatches = await bcrypt.compare(oldpassword, user.password);
    if (!passwordMatches) {
      console.log("passwprd doest not match");
      return errorResponse(res, "Invalid old password", 500);
    }
    console.log("password matched");
    user.password = newpassword;
    await user.save();
    return successResponse(res, "Password changed successfully", 200, user);
  } catch (err) {
    console.log("error changing password:", err);
    return errorResponse(res, err.message, 500);
  }
};

/////////////////////////////////////////////////
//get All users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (users.length) {
      return successResponse(
        res,
        "successfully get all users",
        200,
        users,
        users.length
      );
    }
    return successResponse(res, "No User In Database", 200, users);
  } catch (err) {
    console.log("error finding All Users:", err);
    return errorResponse(res, err.message, 500);
  }
};

////////////////////////////////////////////////
//get single user
exports.getSingleUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log("id:==>", id);
    const user = await User.findById(id);
    console.log("user ====> ", user);
    return successResponse(res, "successfullt get user ", 200, user);
  } catch (err) {
    console.log("error fatching Single User:", err);
    return errorResponse(res, err.message, 500);
  }
};

// Delete Single User
exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log("id====> ", id);
    const deleteUSer = await User.deleteOne({ _id: id });
    console.log("deleteUSer=====>", deleteUSer);
    if (deleteUSer.deletedCount === 0) {
      return errorResponse(res, "User Not Found", 404);
    }
    return successResponse(res, "User successfully deleted", 200);
    // res.send("successfully deleted");
  } catch (err) {
    console.log("error deleting  User:", err);
    return errorResponse(res, err.message, 500);
  }
};
