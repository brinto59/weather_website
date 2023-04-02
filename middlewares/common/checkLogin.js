const jwt = require("jsonwebtoken");

const checkLogin = function (req, res, next) {
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  res.locals.allLocationData = [];
  res.locals.weatherData = {};

  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // console.log(req.user);
      next();
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: "Authentication failure!",
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: {
          msg: "Authentication failure!",
        },
      },
    });
  }
};

const redirectLogin = function (req, res, next) {
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.redirect("/index");
    } catch (err) {
      res.locals.errors = {};
      res.locals.data = {};
      res.render("login");
    }
  } else {
    res.locals.errors = {};
    res.locals.data = {};
    res.render("login");
  }
};

module.exports = { checkLogin, redirectLogin };
