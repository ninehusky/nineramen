function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    if (err.message.includes('username')) {
      err.message = `The username ${req.body.username} is already taken!`;
    }
  } else if (err.name === 'ValidationError') {
    res.status(422);
  }
  console.error(err);
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? err.stack : 'hehe',
  });
}

module.exports = {
  notFound,
  errorHandler,
};
