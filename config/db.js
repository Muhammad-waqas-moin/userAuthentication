const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); // load .env variabless
// console.log("processing ======>", process.env.PORT);
const db = process.env.DATABASE_URL;
const databaseConnection = () => {
  console.log("processing ======>", process.env.PORT);

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("database connection established");
    })
    .catch((e) => {
      console.log("Database connection error:", e.message);
    });
};

module.exports = databaseConnection;
