const getHour = function (time) {
  let regex = /(\d{1,2}):(\d{0,2})/;
  let [, hour] = time.match(regex);

  return hour > 12
    ? `${hour - 12}:00pm`
    : hour == 0
    ? `12:00am`
    : hour == 12
    ? `12:00pm`
    : `${hour}:00am`;
};

const getDay = function (time_epoch) {
  let date = new Date(time_epoch * 1000);
  let dayNumber = date.getDay();
  let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayName[dayNumber];
};

const getMonth = function (time_epoch) {
  let date = new Date(time_epoch * 1000);
  let monthNumber = date.getMonth();
  let monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthName[monthNumber];
};

const getDate = function (time_epoch) {
  return `${date_of_month(time_epoch)} ${getMonth(time_epoch)} ${new Date(
    time_epoch * 1000
  ).getFullYear()}`;
};

const date_of_month = function (time_epoch) {
  return new Date(time_epoch * 1000).getDate();
};
// time between sunrise and sunset
const timeBetween = function (d1, d2) {
  let regex = /(\d{1,2}):(\d{0,2})/;
  let [, d1h, d1m] = d1.match(regex);
  let [, d2h, d2m] = d2.match(regex);
  d1h = eval(d1h);
  d1m = eval(d1m);
  d2h = eval(d2h);
  d2m = eval(d2m);
  let result = (12 - d1h - 1) * 60 + 60 - d1m + d2h * 60 + d2m;
  return result;
};

// time_from_sunrise or time_from_sunset
const timeFromRiseOrSet = function (d1, d2) {
  let regex = /(\d{1,2}):(\d{0,2})/;
  let [, d1h, d1m] = d1.match(regex);
  let [, d2h, d2m] = d2.match(regex);
  d1h = eval(d1h);
  d1m = eval(d1m);
  d2h = eval(d2h);
  d2m = eval(d2m);
  if (d1.indexOf("PM") >= 0) {
    if (d1h != 12) {
      d1h += 12;
    }
  } else if (d1.indexOf("AM") >= 0) {
    if (d1h == 12) {
      d1h = 0;
    }
  }

  return (d2h - d1h - 1) * 60 + 60 - d1m + d2m;
};

module.exports = {
  getHour,
  getDay,
  getMonth,
  getDate,
  date_of_month,
  timeBetween,
  timeFromRiseOrSet,
};
