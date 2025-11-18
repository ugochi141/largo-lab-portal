/**
 * Frontend Logger Utility
 * Structured logging for React application with Sentry integration
 * Kaiser Permanente Largo Laboratory Portal
 */

import * as Sentry from '@sentry/react';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
  }

  /**
   * Debug level logging (development only)
   */
  debug(message: string, context?: Record<string, any>): void {
    if (!this.isDevelopment) return;

    this.log('debug', message, context);
    console.debug(`[DEBUG] ${message}`, context || '');
  }

  /**
   * Info level logging
   */
  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
    console.info(`[INFO] ${message}`, context || '');

    // Add breadcrumb to Sentry
    Sentry.addBreadcrumb({
      category: 'info',
      message,
      level: 'info',
      data: context
    });
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
    console.warn(`[WARN] ${message}`, context || '');

    // Add breadcrumb to Sentry
    Sentry.addBreadcrumb({
      category: 'warning',
      message,
      level: 'warning',
      data: context
    });
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | unknown, context?: Record<string, any>): void {
    this.log('error', message, { ...context, error: error instanceof Error ? error.message : String(error) });
    console.error(`[ERROR] ${message}`, error, context || '');

    // Send to Sentry
    if (error instanceof Error) {
      Sentry.captureException(error, {
        contexts: {
          custom: context
        }
      });
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        contexts: {
          custom: context
        }
      });
    }
  }

  /**
   * Log user action for analytics
   */
  userAction(action: string, details?: Record<string, any>): void {
    const sanitizedDetails = this.sanitizeData(details || {});

    this.info(`User Action: ${action}`, sanitizedDetails);

    // Add to Sentry breadcrumb
    Sentry.addBreadcrumb({
      category: 'user',
      message: action,
      level: 'info',
      data: sanitizedDetails
    });
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, duration: number, details?: Record<string, any>): void {
    const logMessage = `Performance: ${operation} - ${duration}ms`;

    this.info(logMessage, { duration, ...details });

    // Track in Sentry
    Sentry.addBreadcrumb({
      category: 'performance',
      message: operation,
      level: 'info',
      data: {
        duration,
        ...details
      }
    });
  }

  /**
   * Log API calls
   */
  apiCall(method: string, url: string, statusCode?: number, duration?: number): void {
    const level = statusCode && statusCode >= 400 ? 'warn' : 'info';
    const message = `API ${method} ${url} - ${statusCode || 'pending'}`;

    this[level](message, {
      method,
      url,
      statusCode,
      duration: duration ? `${duration}ms` : undefined
    });
  }

  /**
   * Log navigation events
   */
  navigation(from: string, to: string): void {
    this.info(`Navigation: ${from} → ${to}`, {
      from,
      to,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level,
      message,
      context: context ? this.sanitizeData(context) : undefined,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Add to buffer
    this.logBuffer.push(entry);

    // Maintain buffer size
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Send to backend in production (optional)
    if (this.isProduction && level === 'error') {
      this.sendToBackend(entry);
    }
  }

  /**
   * Sanitize sensitive data from logs
   */
  private sanitizeData(data: Record<string, any>): Record<string, any> {
    const sensitiveKeys = ['password', 'token', 'secret', 'authorization', 'ssn', 'dob', 'mrn', 'patientId'];
    const sanitized: Record<string, any> = {};

    Object.keys(data).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        sanitized[key] = this.sanitizeData(data[key]);
      } else {
        sanitized[key] = data[key];
      }
    });

    return sanitized;
  }

  /**
   * Send logs to backend
   */
  private async sendToBackend(entry: LogEntry): Promise<void> {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Fail silently - don't create infinite loop
      console.error('Failed to send log to backend:', error);
    }
  }

  /**
   * Get recent logs (for debugging)
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  /**
   * Clear log buffer
   */
  clearLogs(): void {
    this.logBuffer = [];
  }

  /**
   * Export logs (for support/debugging)
   */
  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports
export default logger;
