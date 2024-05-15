const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/helper");

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("token ====>", token);

    if (token) {
      token = token.split(" ")[1];
      const user = jwt.verify(token, process.env.SECRATKEY);
      req.userId = user.id;
    } else {
      //   console.log("errorrrrr");
      return errorResponse(res, "unAuthorized User", 401);
    }
    next();
  } catch (err) {
    console.log("err:", err);
    return errorResponse(res, "unAuthorized User", 401);
  }
};

module.exports = auth;
