const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
  },
  real_time_info: {
    date: Number,
    last_updated: String,
    temp_c: Number,
    maxtemp_c: Number,
    mintemp_c: Number,
    feels_like: Number,
    condition: String,
    condition_code: Number,
    wind_kph: Number,
    wind_dir: String,
    is_day: Number,
    uv: Number,
    humidity: Number,
    sunrise: String,
    sunset: String,
    time_between: Number,
    time_from_sunrise: Number,
    time_from_sunset: Number,
    moonrise: String,
    moonset: String,
  },
  forecastday: [
    {
      date: Number,
      day: String,
      month: String,
      date_of_month: Number,
      maxtemp_c: Number,
      mintemp_c: Number,
      condition_code: Number,
      forecasthour: [
        {
          time: Number,
          hour: String,
          temp_c: Number,
          is_day: Number,
          condition_code: Number,
        },
      ],
    },
  ],
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
