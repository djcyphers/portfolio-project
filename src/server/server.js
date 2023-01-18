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
process.env.NODE_ENV = 'production';

// Suppress warning
mongoose.set('strictQuery', true);
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
app.use(morgan("dev")); // configure morgan
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

app.use(express.static(path.join(__dirname, "/../../dist")));

const userRoutes = require("./api/user/route/user"); // bring in our user routes
app.use("/user", userRoutes);

// Gallery routes
const galleryRoutes = require("./api/user/route/gallery");
app.use("/gallery", galleryRoutes);

// Blog routes
const blogRoutes = require("./api/user/route/blog");
app.use("/blog", blogRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  next(res.status(500).send('Express: Something went wrong!'));
});

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});