const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const loginUserValidators = [
  check("email").isEmail().withMessage("Invalid email!"),
  check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

const loginUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (!errors.isEmpty()) {
    res.render("login", {
      data: req.body.email,
      errors: mappedErrors,
    });
  } else {
    next();
  }
};

module.exports = { loginUserValidators, loginUserValidationHandler };
