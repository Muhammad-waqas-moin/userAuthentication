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

//User Routes
const userRoute = require("./Route/UsersRoutes");
app.use("/api/v1", userRoute);
// app.use("/api/v1", userRoute);
// app.use("/api/v1", userRoute);
// app.use("/api/v1", userRoute);
// app.use("/api/v1", userRoute);

//OPT verify Route
const optRoute = require("./Route/OPTRoutes");
app.use("/api/v1", optRoute);
