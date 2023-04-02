const errorHandler = function (err, req, res, next) {
  if (err.message) {
    res.locals.errorCode = err.status ? err.status : 500;
    res.locals.error = err.message;
  } else {
    res.locals.errorCode = 500;
    res.locals.error = err;
  }
  res.render("error");
};

module.exports = errorHandler;
