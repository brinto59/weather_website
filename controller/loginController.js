const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const User = require("../models/People");
const Location = require("../models/Location");

const getLogin = function (req, res, next) {
  res.locals.errors = {};
  res.locals.data = {};
  res.render("login");
};

const login = async function (req, res, next) {
  res.locals.errors = {};
  res.locals.data = {};
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const validpassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validpassword) {
        const userObject = {
          name: user.name,
          email: user.email,
          id: user._id,
        };
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
        });

        res.cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          signed: true,
          maxAge: process.env.JWT_EXPIRES,
        });
        // let allLocationData = await Location.find({ user_id: user._id });
        // res.locals.allLocationData = allLocationData;
        // res.locals.weatherData = {};
        res.locals.loggedInUser = userObject;
        res.redirect("index");
      } else {
        throw createError("Invalid email or password");
      }
    } else {
      throw createError("Invalid email or password");
    }
  } catch (err) {
    res.render("login", {
      data: req.body.email,
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};
module.exports = { getLogin, login };
