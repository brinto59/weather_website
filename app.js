// external imports
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

// internal imports
const loginRouter = require("./router/loginRouter");
const indexRouter = require("./router/indexRouter");
const cityRouter = require("./router/cityRouter");
const signupRouter = require("./router/signupRouter");
const errorHandler = require("./middlewares/common/errorHandler");

const app = express();
dotenv.config();

// database connection
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// view engine
app.set("view engine", "ejs");

// router setup
app.use("/", loginRouter);
app.use("/signup", signupRouter);
app.use("/index", indexRouter);
app.use("/cities", cityRouter);

// error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
