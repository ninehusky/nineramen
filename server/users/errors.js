const config = require('config');

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

function handleError(err, req, res, next) {
  if (err.name === 'ValidationError') {
    res.status(422);
  } else if (err.code === 11000) {
    err.message = 'That username is already taken.';
    res.status(422);
  }
  if (res.statusCode >= 400 && res.statusCode <= 500) {
    res.status(res.statusCode);
  } else {
    res.status(err.statusCode || 500);
  }
  res.json({
    error: {
      message: err.message,
    },
    stack: config.get('nodeEnv') === 'production' ? err.stack : 'hehe',
  });
  return next(); // this could be a very problematic statement
}

process.on('unhandledRejection', (reason, p) => {
  throw reason;
});

process.on('uncaughtException', (error) => {
  handleError(error);
});

module.exports = {
  notFound,
  handleError,
};
