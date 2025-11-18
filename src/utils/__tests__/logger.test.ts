/**
 * Logger Utility Tests
 */

import { logger } from '../logger';
import * as Sentry from '@sentry/react';

// Mock Sentry
jest.mock('@sentry/react');

describe('Logger Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.debug = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  describe('debug', () => {
    it('should log debug messages in development', () => {
      logger.debug('Test debug message', { key: 'value' });

      // In test environment, debug should be called
      expect(console.debug).toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test info message');

      expect(console.info).toHaveBeenCalledWith(
        '[INFO] Test info message',
        ''
      );
    });

    it('should add breadcrumb to Sentry', () => {
      logger.info('Test info', { data: 'value' });

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'info',
        message: 'Test info',
        level: 'info',
        data: { data: 'value' }
      });
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning');

      expect(console.warn).toHaveBeenCalledWith(
        '[WARN] Test warning',
        ''
      );
    });

    it('should add breadcrumb to Sentry', () => {
      logger.warn('Warning message');

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'warning',
        message: 'Warning message',
        level: 'warning',
        data: undefined
      });
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(console.error).toHaveBeenCalled();
    });

    it('should capture exception in Sentry', () => {
      const error = new Error('Test error');
      logger.error('Error message', error, { context: 'test' });

      expect(Sentry.captureException).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          contexts: {
            custom: expect.objectContaining({ context: 'test' })
          }
        })
      );
    });
  });

  describe('userAction', () => {
    it('should log user actions', () => {
      logger.userAction('button_click', { buttonId: 'submit' });

      expect(console.info).toHaveBeenCalled();
      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'user',
        message: 'button_click',
        level: 'info',
        data: { buttonId: 'submit' }
      });
    });

    it('should sanitize sensitive data', () => {
      logger.userAction('login_attempt', {
        username: 'test',
        password: 'secret123'
      });

      const breadcrumbCall = (Sentry.addBreadcrumb as jest.Mock).mock.calls[0][0];
      expect(breadcrumbCall.data.password).toBe('[REDACTED]');
      expect(breadcrumbCall.data.username).toBe('test');
    });
  });

  describe('performance', () => {
    it('should log performance metrics', () => {
      logger.performance('api_call', 250, { endpoint: '/api/test' });

      expect(console.info).toHaveBeenCalled();
      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'performance',
        message: 'api_call',
        level: 'info',
        data: {
          duration: 250,
          endpoint: '/api/test'
        }
      });
    });
  });

  describe('apiCall', () => {
    it('should log successful API calls', () => {
      logger.apiCall('GET', '/api/inventory', 200, 150);

      expect(console.info).toHaveBeenCalledWith(
        '[INFO] API GET /api/inventory - 200',
        expect.objectContaining({
          method: 'GET',
          url: '/api/inventory',
          statusCode: 200,
          duration: '150ms'
        })
      );
    });

    it('should log failed API calls as warnings', () => {
      logger.apiCall('POST', '/api/data', 404, 100);

      expect(console.warn).toHaveBeenCalledWith(
        '[WARN] API POST /api/data - 404',
        expect.objectContaining({
          statusCode: 404
        })
      );
    });
  });

  describe('data sanitization', () => {
    it('should redact sensitive keys', () => {
      logger.info('Test', {
        username: 'user',
        password: 'secret',
        token: 'abc123',
        data: 'safe'
      });

      const breadcrumb = (Sentry.addBreadcrumb as jest.Mock).mock.calls[0][0];
      expect(breadcrumb.data.password).toBe('[REDACTED]');
      expect(breadcrumb.data.token).toBe('[REDACTED]');
      expect(breadcrumb.data.username).toBe('user');
      expect(breadcrumb.data.data).toBe('safe');
    });

    it('should recursively sanitize nested objects', () => {
      logger.info('Test', {
        user: {
          name: 'John',
          password: 'secret'
        }
      });

      const breadcrumb = (Sentry.addBreadcrumb as jest.Mock).mock.calls[0][0];
      expect(breadcrumb.data.user.name).toBe('John');
      expect(breadcrumb.data.user.password).toBe('[REDACTED]');
    });
  });

  describe('buffer management', () => {
    it('should maintain recent logs', () => {
      for (let i = 0; i < 10; i++) {
        logger.info(`Message ${i}`);
      }

      const recentLogs = logger.getRecentLogs(5);
      expect(recentLogs).toHaveLength(5);
    });

    it('should clear logs', () => {
      logger.info('Test message');
      logger.clearLogs();

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(0);
    });

    it('should export logs as JSON', () => {
      logger.info('Export test');
      const exported = logger.exportLogs();

      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
    });
  });
});
