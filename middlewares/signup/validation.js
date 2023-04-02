const { check, validationResult } = require("express-validator");
const User = require("../../models/People");
const createError = require("http-errors");
const fs = require("fs");
const path = require("path");

let passwordValue;

const userValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain other than alphabets")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const data = await User.findOne({ email: value });
        if (data) {
          throw createError("Email already in use");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be 8 characters long and should contain 1 lowercase, 1 uppercase, 1 symbols and 1 number."
    ),
];

const userValidationHandler = function (req, res, next) {
  const error = validationResult(req);
  const mappedError = error.mapped();

  if (!error.isEmpty()) {
    if (req.files && req.files.length > 0) {
      const filename = req.files[0].filename;
      fs.unlink(
        path.join(__dirname, `../../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    res.status(500).json({
      errors: mappedError,
    });
  } else {
    next();
  }
};

// two password should match
function passwordSame(req, res, next) {
  if (req.body.password.localeCompare(req.body.rePassword) == 0) {
    next();
  } else {
    res.status(500).json({
      errors: {
        rePassword: {
          msg: "Passwords should match",
        },
      },
    });
  }
}

module.exports = {
  userValidators,
  userValidationHandler,
  passwordSame,
};
