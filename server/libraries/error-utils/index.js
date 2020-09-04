function notFound(req, res, next) {
  res.status(404);
  next(new Error('Endpoint not found.'));
}

function handleError(err, req, res, next) {
  if (err.name === 'ValidationError') {
    res.status(422);
  } else if (err.statusCode) {
    res.status(err.statusCode);
  } else if (err.code === 11000) {
    err.message = 'A resource with that tag already exists.';
    res.status(422);
  } else if (res.statusCode >= 400 && res.statusCode <= 500) {
    res.status(res.statusCode);
  } else {
    res.status(res.statusCode || 500);
  }
  res.json({
    message: err.message,
    stack: err.stack,
  });
  return next();
}

module.exports = {
  notFound,
  handleError,
};
