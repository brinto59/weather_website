// external imports
const express = require("express");

//internal imports
const { getLogin, login } = require("../controller/loginController");
const {
  loginUserValidators,
  loginUserValidationHandler,
} = require("../middlewares/login/loginValidation");
const { redirectLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

//get page
router.get("/", redirectLogin, getLogin);

// login
router.post("/", loginUserValidators, loginUserValidationHandler, login);

module.exports = router;
