/**
 * Winston Logger Configuration
 * Centralized logging configuration for HIPAA compliance
 * Kaiser Permanente Largo Laboratory Portal
 */

const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug');

/**
 * Custom log format with colors for console
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  })
);

/**
 * JSON format for file logging
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * HIPAA Audit format (strictly structured for compliance)
 */
const auditFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.json(),
  winston.format((info) => {
    // Ensure all audit logs have required fields
    return {
      timestamp: info.timestamp,
      level: 'audit',
      action: info.action || 'unknown',
      userId: info.userId || 'anonymous',
      resource: info.resource || 'unknown',
      ip: info.ip || 'unknown',
      success: info.success !== undefined ? info.success : true,
      details: info.details || {},
      sessionId: info.sessionId || null,
      ...info
    };
  })()
);

/**
 * Sensitive data redactor
 */
const redactSensitiveData = winston.format((info) => {
  const sensitiveKeys = ['password', 'token', 'secret', 'authorization', 'cookie', 'ssn', 'dob', 'mrn', 'patientId'];

  const redact = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    const redacted = { ...obj };
    Object.keys(redacted).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        redacted[key] = '[REDACTED]';
      } else if (typeof redacted[key] === 'object') {
        redacted[key] = redact(redacted[key]);
      }
    });

    return redacted;
  };

  return redact(info);
});

/**
 * Create logger transports
 */
const transports = [
  // Console transport (development)
  new winston.transports.Console({
    level: LOG_LEVEL,
    format: consoleFormat,
    silent: NODE_ENV === 'test'
  }),

  // Application logs (all levels)
  new winston.transports.DailyRotateFile({
    filename: path.join('logs', 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    level: 'info',
    format: fileFormat,
    auditFile: path.join('logs', '.application-audit.json')
  }),

  // Error logs (errors only)
  new winston.transports.DailyRotateFile({
    filename: path.join('logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
    format: fileFormat,
    auditFile: path.join('logs', '.error-audit.json')
  }),

  // HIPAA Audit logs (7 year retention)
  new winston.transports.DailyRotateFile({
    filename: path.join('logs', 'audit-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '100m',
    maxFiles: process.env.AUDIT_LOG_RETENTION_DAYS || '2555d', // 7 years
    level: 'info',
    format: auditFormat,
    auditFile: path.join('logs', '.audit-audit.json')
  }),

  // Performance logs
  new winston.transports.DailyRotateFile({
    filename: path.join('logs', 'performance-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '7d',
    level: 'info',
    format: fileFormat,
    auditFile: path.join('logs', '.performance-audit.json')
  }),

  // Security logs
  new winston.transports.DailyRotateFile({
    filename: path.join('logs', 'security-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m',
    maxFiles: '90d', // 3 months
    level: 'warn',
    format: fileFormat,
    auditFile: path.join('logs', '.security-audit.json')
  })
];

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    redactSensitiveData(),
    fileFormat
  ),
  defaultMeta: {
    service: 'largo-lab-portal',
    environment: NODE_ENV,
    version: process.env.VITE_APP_VERSION || '3.0.0'
  },
  transports,
  exitOnError: false
});

/**
 * Custom logging methods
 */
logger.audit = (action, details) => {
  logger.log('info', 'HIPAA Audit Event', {
    action,
    ...details,
    timestamp: new Date().toISOString()
  });
};

logger.performance = (operation, duration, details) => {
  logger.info('Performance Metric', {
    operation,
    duration: `${duration}ms`,
    ...details
  });
};

logger.security = (event, details) => {
  logger.warn('Security Event', {
    event,
    ...details,
    timestamp: new Date().toISOString()
  });
};

/**
 * Error logging helper with stack trace
 */
logger.logError = (error, context = {}) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context
  });
};

/**
 * HTTP request logging helper
 */
logger.logRequest = (req, res, duration) => {
  const log = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    requestId: req.id
  };

  if (res.statusCode >= 500) {
    logger.error('HTTP Request Error', log);
  } else if (res.statusCode >= 400) {
    logger.warn('HTTP Request Warning', log);
  } else {
    logger.info('HTTP Request', log);
  }
};

/**
 * Log levels reference:
 *
 * error: System errors, exceptions, failures
 * warn: Warning conditions, potential issues
 * info: Informational messages, normal operations
 * http: HTTP request logging
 * verbose: Detailed information for debugging
 * debug: Debug-level messages
 * silly: Very detailed debugging information
 */

module.exports = logger;
