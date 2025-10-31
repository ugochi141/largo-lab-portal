/**
 * Security Headers Middleware
 * Implements comprehensive security headers for healthcare compliance
 */

const securityHeaders = (req, res, next) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');

  // Security headers for HIPAA compliance
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Cache control for sensitive data
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.id);

  // Add timestamp
  res.setHeader('X-Response-Time', new Date().toISOString());

  next();
};

module.exports = { securityHeaders };