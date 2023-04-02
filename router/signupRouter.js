// external imports
const express = require("express");

//internal imports
const { getSignup, signUp } = require("../controller/signupController");
const {
  userValidators,
  userValidationHandler,
  passwordSame,
} = require("../middlewares/signup/validation");
const avatarUpload = require("../middlewares/signup/avatarUpload");

const router = express.Router();

//get page
router.get("/", getSignup);

// sign up
router.post(
  "/",
  avatarUpload,
  userValidators,
  userValidationHandler,
  passwordSame,
  signUp
);

module.exports = router;
