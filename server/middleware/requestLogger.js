/**
 * Request Logger Middleware
 * Logs all incoming requests with rotation
 */

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  global.logger.info('Incoming request', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    global.logger.info('Request completed', {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    // Log slow requests
    if (duration > 1000) {
      global.logger.warn('Slow request detected', {
        requestId: req.id,
        path: req.path,
        duration: `${duration}ms`
      });
    }
  });

  next();
};

module.exports = { requestLogger };