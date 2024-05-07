// const express = require("express");
// const app = express();
// const port = 3000;
// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     data: "this router working fine",
//   });
// });
// app.listen(port, () => {
//   console.log(`server working on port:${port}`);
// });

const app = require("./app");
const port = process.env.PORT || 5000;

//Database Connection
const databaseConnection = require("./config/db");
databaseConnection();
app.listen(port, () => {
  console.log(`server runnning on port:${port}`);
});

//Route
const userRegister = require("./Route/userRoute");
const userLogin = require("./Route/loginRoute");
const userChangePassword = require("./Route/changePasswordRoute");
const userForgetPassword = require("./Route/forgetPassRoute");
app.use("/api/v1", userRegister);
app.use("/api/v1", userLogin);
app.use("/api/v1", userChangePassword);
app.use("/api/v1", userForgetPassword);
