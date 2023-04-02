const createError = require("http-errors");

const Location = require("../models/Location");
const User = require("../models/People");
const {
  getHour,
  getDay,
  getMonth,
  getDate,
  date_of_month,
  timeBetween,
  timeFromRiseOrSet,
} = require("../utilities/timeUtilities");

const getIndex = async function (req, res, next) {
  try {
    let allLocationData = await Location.find({ user_id: req.user.id });
    res.locals.allLocationData = allLocationData;
    let userData = await User.findOne({ _id: req.user.id });
    if (userData.avatar) {
      res.locals.avatar = userData.avatar;
    } else {
      res.locals.avatar = "nophoto.png";
    }
    if (allLocationData && allLocationData.length != 0) {
      res.locals.weatherData = allLocationData[0];
    } else {
      res.locals.weatherData = {};
    }
    res.render("index");
  } catch (err) {
    next(err);
  }
};

const getWeatherData = async function (req, res, next) {
  try {
    let data = await Location.findOne({
      _id: req.params.locationId,
      user_id: req.user.id,
    });
    if (data) {
      res.json({
        data,
      });
    } else {
      throw createError("Not found");
    }
  } catch (err) {
    next(err);
  }
};

const getRefresh = async function (req, res, next) {
  const codeRegex = new RegExp("(\\d+).png");
  try {
    let placeData = await Location.find({
      user_id: req.user.id,
    });
    if (placeData.length > 0) {
      placeData.forEach(async (place) => {
        let response = await fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${place.name}&days=14&aqi=no&alerts=no`
        );
        let result = await response.json();
        if (!result.error) {
          let forecastday = [];
          let forecasthour = [];
          for (let i = 0; i < result.forecast.forecastday.length; i++) {
            for (
              let j = 0;
              j < result.forecast.forecastday[i].hour.length;
              j++
            ) {
              forecasthour.push({
                time: result.forecast.forecastday[i].hour[j].time_epoch,
                hour: getHour(result.forecast.forecastday[i].hour[j].time),
                temp_c: result.forecast.forecastday[i].hour[j].temp_c,
                is_day: result.forecast.forecastday[i].hour[j].is_day,
                condition_code:
                  result.forecast.forecastday[i].hour[j].condition.icon.match(
                    codeRegex
                  )[1],
              });
            }
            // console.log(forecasthour);
            forecastday.push({
              date: result.forecast.forecastday[i].date_epoch,
              day: getDay(result.forecast.forecastday[i].date_epoch),
              month: getMonth(result.forecast.forecastday[i].date_epoch),
              date_of_month: date_of_month(
                result.forecast.forecastday[i].date_epoch
              ),
              maxtemp_c: result.forecast.forecastday[i].day.maxtemp_c,
              mintemp_c: result.forecast.forecastday[i].day.mintemp_c,
              condition_code:
                result.forecast.forecastday[i].day.condition.icon.match(
                  codeRegex
                )[1],
              forecasthour: forecasthour,
            });
            forecasthour = [];
          }
          real_time_info = {
            date: result.location.localtime_epoch,
            last_updated: getDate(result.current.last_updated_epoch),
            temp_c: result.current.temp_c,
            maxtemp_c: result.forecast.forecastday[0].day.maxtemp_c,
            mintemp_c: result.forecast.forecastday[0].day.mintemp_c,
            feels_like: result.current.feelslike_c,
            condition: result.current.condition.text,
            condition_code: result.current.condition.icon.match(codeRegex)[1],
            wind_kph: result.current.wind_kph,
            wind_dir: result.current.wind_dir,
            is_day: result.current.is_day,
            uv: result.current.uv,
            humidity: result.current.humidity,
            sunrise: result.forecast.forecastday[0].astro.sunrise,
            sunset: result.forecast.forecastday[0].astro.sunset,
            time_between: timeBetween(
              result.forecast.forecastday[0].astro.sunrise,
              result.forecast.forecastday[0].astro.sunset
            ),
            time_from_sunrise: timeFromRiseOrSet(
              result.forecast.forecastday[0].astro.sunrise,
              result.location.localtime
            ),
            time_from_sunset: timeFromRiseOrSet(
              result.forecast.forecastday[0].astro.sunset,
              result.location.localtime
            ),
            moonrise: result.forecast.forecastday[0].astro.moonrise,
            moonset: result.forecast.forecastday[0].astro.moonset,
          };
          let d = await Location.findByIdAndUpdate(place._id, {
            real_time_info: real_time_info,
            forecastday: forecastday,
          });
        } else {
          throw createError("Internal server error!");
        }
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

const getPageAfterRefresh = async function (req, res, next) {
  try {
    let data = await Location.findOne({
      _id: req.params.locationId,
      user_id: req.user.id,
    });
    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

const logout = function (req, res, next) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("logged out");
};

module.exports = {
  getIndex,
  getWeatherData,
  getRefresh,
  getPageAfterRefresh,
  logout,
};
