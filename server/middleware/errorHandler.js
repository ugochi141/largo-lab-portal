/**
 * Global Error Handler Middleware
 * Handles all errors with proper logging and client responses
 * HIPAA Compliant - Sanitizes PHI from error messages
 */

const Sentry = require('@sentry/node');

class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

// Production error sanitization
const sanitizeError = (error) => {
  // Remove any potential PHI from error messages
  const phiPatterns = [
    /\d{3}-\d{2}-\d{4}/g, // SSN
    /MRN[:\s]*\w+/gi, // MRN
    /patient[:\s]*\w+/gi, // Patient identifiers
    /\b\d{10}\b/g, // Phone numbers
  ];

  let sanitizedMessage = error.message;
  phiPatterns.forEach(pattern => {
    sanitizedMessage = sanitizedMessage.replace(pattern, '[REDACTED]');
  });

  return sanitizedMessage;
};

// Main error handler
const errorHandler = (err, req, res, next) => {
  // Default to 500 server error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error details
  const errorDetails = {
    requestId: req.id,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  };

  // Log to Winston
  if (err.statusCode >= 500) {
    global.logger.error('Server Error', errorDetails);

    // Send to Sentry for 500 errors
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(err, {
        contexts: {
          request: {
            requestId: req.id,
            path: req.path,
            method: req.method
          }
        }
      });
    }
  } else {
    global.logger.warn('Client Error', errorDetails);
  }

  // Prepare response based on environment
  const response = {
    error: true,
    requestId: req.id,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'production') {
    // Production: sanitized error messages
    response.message = err.isOperational ?
      sanitizeError(err) :
      'An unexpected error occurred. Please contact support.';

    if (err.statusCode >= 400 && err.statusCode < 500) {
      response.message = err.message; // Client errors can be shown
    }
  } else {
    // Development: full error details
    response.message = err.message;
    response.stack = err.stack;
    response.details = err;
  }

  res.status(err.statusCode).json(response);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Database error handler
const handleDatabaseError = (error) => {
  if (error.code === '23505') {
    return new AppError('Duplicate entry found', 409);
  }
  if (error.code === '23503') {
    return new AppError('Referenced record not found', 400);
  }
  if (error.code === '22P02') {
    return new AppError('Invalid input format', 400);
  }
  if (error.code === 'ECONNREFUSED') {
    return new AppError('Database connection failed', 503);
  }
  return new AppError('Database operation failed', 500);
};

// Validation error handler
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(e => e.message);
  return new AppError(`Validation failed: ${errors.join(', ')}`, 400);
};

// JWT error handler
const handleJWTError = () =>
  new AppError('Invalid authentication token', 401);

const handleJWTExpiredError = () =>
  new AppError('Your session has expired. Please log in again', 401);

// Rate limit error handler
const handleRateLimitError = () =>
  new AppError('Too many requests. Please try again later.', 429);

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
  handleDatabaseError,
  handleValidationError,
  handleJWTError,
  handleJWTExpiredError,
  handleRateLimitError
};