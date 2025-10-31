function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const message = err.message || 'Server Error';
  res.status(status).json({ success: false, msg: message });
}

module.exports = errorHandler;
