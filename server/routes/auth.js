/**
 * Authentication Routes
 * Handles user authentication and authorization
 * HIPAA compliant with audit logging
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Mock user database (in production, use real database)
const users = new Map([
  ['admin', {
    id: '1',
    username: 'admin',
    password: '$2a$10$xQX6J.6nGGQXRTLmRKQWXeQxL5mYFyUqVQaTUVbJSuHvhQGx7pLm6', // 'admin123'
    role: 'ADMIN',
    department: 'Laboratory',
    permissions: ['all']
  }]
]);

// Login endpoint
router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    throw new AppError('Username and password are required', 400);
  }

  // Find user
  const user = users.get(username);

  if (!user) {
    // Log failed attempt
    global.logger.warn('Failed login attempt', {
      username,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    throw new AppError('Invalid credentials', 401);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    // Log failed attempt
    global.logger.warn('Failed login attempt - incorrect password', {
      username,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    throw new AppError('Invalid credentials', 401);
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      department: user.department
    },
    process.env.JWT_SECRET || 'default-secret-change-in-production',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );

  // Log successful login (HIPAA audit requirement)
  global.logger.info('User login successful', {
    userId: user.id,
    username: user.username,
    role: user.role,
    ip: req.ip,
    sessionId: req.session?.id,
    timestamp: new Date().toISOString()
  });

  // Remove password from response
  const userResponse = {
    id: user.id,
    username: user.username,
    role: user.role,
    department: user.department,
    permissions: user.permissions
  };

  res.json({
    success: true,
    token,
    user: userResponse,
    expiresIn: '7d'
  });
}));

// Logout endpoint
router.post('/logout', asyncHandler(async (req, res) => {
  // Log logout (HIPAA audit requirement)
  global.logger.info('User logout', {
    userId: req.user?.id,
    username: req.user?.username,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // In production, invalidate token in Redis/database
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// Verify token endpoint
router.get('/verify', asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('No token provided', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret-change-in-production'
    );

    res.json({
      valid: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        department: decoded.department
      }
    });
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
}));

// Change password endpoint
router.post('/change-password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  // Decode token
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || 'default-secret-change-in-production'
  );

  const user = users.get(decoded.username);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Validate new password
  if (newPassword.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password (in production, update in database)
  user.password = hashedPassword;

  // Log password change (HIPAA audit)
  global.logger.info('Password changed', {
    userId: user.id,
    username: user.username,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// Session info endpoint
router.get('/session', asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('No session', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret-change-in-production'
    );

    const user = users.get(decoded.username);

    if (!user) {
      throw new AppError('Session invalid', 401);
    }

    res.json({
      active: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
        permissions: user.permissions
      },
      expiresAt: new Date(decoded.exp * 1000).toISOString()
    });
  } catch (error) {
    throw new AppError('Session expired', 401);
  }
}));

// Role check endpoint
router.get('/check-permission/:permission', asyncHandler(async (req, res) => {
  const { permission } = req.params;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.json({ hasPermission: false });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret-change-in-production'
    );

    const user = users.get(decoded.username);

    const hasPermission = user?.permissions?.includes('all') ||
                         user?.permissions?.includes(permission);

    res.json({
      hasPermission,
      user: decoded.username,
      permission
    });
  } catch (error) {
    res.json({ hasPermission: false });
  }
}));

module.exports = router;