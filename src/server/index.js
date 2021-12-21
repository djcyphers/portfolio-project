/*
  Server Configuration v1.0 with MongoDB, ExpressJS
*/
require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/db");
const path = require("path");
const app = express();

//configure database and mongoose
mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    user: config.user,
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
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(express.urlencoded({ extended: false }));
//configure body-parser ends here
app.use(morgan("dev")); // configire morgan
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Expose-Headers");
  next();
});

app.use(express.static(path.join(__dirname, "/../../public")));

const userRoutes = require("./api/user/route/user"); // bring in our user routes
app.use("/user", userRoutes);

// Galler routes
const galleryRoutes = require("./api/user/route/gallery");
app.use("/gallery", galleryRoutes);

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
