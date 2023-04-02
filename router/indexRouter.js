// external imports
const express = require("express");

//internal imports
const {
  getIndex,
  getWeatherData,
  getRefresh,
  getPageAfterRefresh,
  logout,
} = require("../controller/indexController");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

//get page
router.get("/", checkLogin, getRefresh, getIndex);

// get particular location's weather data
router.get("/weather/:locationId", checkLogin, getWeatherData);

//refresh
router.get("/refresh/:locationId", checkLogin, getRefresh, getPageAfterRefresh);

// logout
router.delete("/logout", logout);

module.exports = router;
