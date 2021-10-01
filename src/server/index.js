require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/db");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

//configure database and mongoose
mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    user: process.env.DB_USER,
    pass: config.secret,
  })
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log({ database_error: err });
  });

// db configuaration ends here
//registering cors
app.use(cors());
//configure body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
//configure body-parser ends here
app.use(morgan("dev")); // configire morgan
// define first route
// app.get("/", (req, res) => {
//   console.log("Hello MEVN Soldier");
// });
const userRoutes = require("./api/user/route/user"); // bring in our user routes
app.use("/user", userRoutes);
app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
