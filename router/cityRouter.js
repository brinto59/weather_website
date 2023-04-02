// external imports
const express = require("express");

//internal imports
const {
  getCityManager,
  getPlaces,
  addPlace,
  deletePlace,
} = require("../controller/manageCityController");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

//get page
router.get("/", checkLogin, getCityManager);

//search places
router.get("/search/:placeName", checkLogin, getPlaces);

// add place
router.get("/addPlace/:placeName", checkLogin, addPlace);

// delete place
router.delete("/deletePlace/:placeId", checkLogin, deletePlace);

module.exports = router;
