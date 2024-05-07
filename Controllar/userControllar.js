const User = require("../model/UserSchema");

// // exports.CreateUser = async (req, res, next) => {
// //   console.log("route hitting????");
// //   res.send("user created successfully");
// // };

// async function checkUserExistence(email, phonenumber) {
//   try {
//     console.log("===============>");
//     console.log(email, phonenumber);
//     const isUserAlreadyRegistered = await User.findOne({
//       $or: [{ email: email }, { phoneNumber: phonenumber }],
//     });
//     if (isUserAlreadyRegistered) {
//       console.log("true??");
//       return true;
//     }
//     console.log("false??");
//     return false;
//   } catch (err) {
//     console.log("Error in checking user existence:", err.message);
//   }
// }

// exports.createUser = async (req, res, next) => {
//   //   console.log("route hitting????");
//   try {
//     const { email, phoneNumber } = req.body;
//     const isUser = await checkUserExistence(email, phoneNumber);
//     if (isUser) {
//       console.log("user already exists");
//       return;
//     }
//     const result = await User.create(req.body);
//     res.status(200).json({
//       status: "success",
//       message: "successfully created",
//     });
//     // res.send("user created successfully");
//   } catch (err) {
//     res.status(400).json({
//       status: "failed",
//       message: "unsucceeded",
//     });
//   }
// };
////////////////////////////////////////////////////////
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
    console.log("User does not exist");
    return false;
  } catch (err) {
    console.log("Error in checking user existence:", err.message);
    throw err; // This ensures the error bubbles up to the caller function
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
