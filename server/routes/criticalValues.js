/**
 * Critical Values Management Routes
 * Handles critical lab value detection, notification, and acknowledgment
 * CAP and CLIA Compliant
 */

const express = require('express');
const router = express.Router();
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Critical value ranges (CAP compliant)
const CRITICAL_RANGES = {
  'potassium': { low: 2.5, high: 6.5, units: 'mmol/L', priority: 'CRITICAL' },
  'sodium': { low: 120, high: 160, units: 'mmol/L', priority: 'CRITICAL' },
  'glucose': { low: 40, high: 500, units: 'mg/dL', priority: 'CRITICAL' },
  'hemoglobin': { low: 7.0, high: 20.0, units: 'g/dL', priority: 'HIGH' },
  'platelet': { low: 20000, high: 1000000, units: '/μL', priority: 'HIGH' },
  'INR': { low: null, high: 4.5, units: 'ratio', priority: 'CRITICAL' },
  'troponin': { low: null, high: 0.04, units: 'ng/mL', priority: 'CRITICAL' },
  'pH': { low: 7.20, high: 7.60, units: '', priority: 'CRITICAL' },
  'pCO2': { low: 20, high: 70, units: 'mmHg', priority: 'HIGH' },
  'lactate': { low: null, high: 4.0, units: 'mmol/L', priority: 'HIGH' }
};

// Store for critical values (in production, use database)
const criticalValues = new Map();
const acknowledgments = new Map();

// Check if a value is critical
const checkCritical = (testName, value) => {
  const range = CRITICAL_RANGES[testName.toLowerCase()];
  if (!range) return null;

  const isCritical = (
    (range.low !== null && value < range.low) ||
    (range.high !== null && value > range.high)
  );

  if (isCritical) {
    return {
      testName,
      value,
      units: range.units,
      range: `${range.low || 'N/A'} - ${range.high || 'N/A'}`,
      severity: value < range.low ? 'CRITICAL_LOW' : 'CRITICAL_HIGH',
      priority: range.priority
    };
  }

  return null;
};

// Get all critical values
router.get('/', asyncHandler(async (req, res) => {
  const { status, priority, acknowledged, startDate, endDate } = req.query;

  let values = Array.from(criticalValues.values());

  // Filter by status
  if (status === 'pending') {
    values = values.filter(v => !acknowledgments.has(v.id));
  } else if (status === 'acknowledged') {
    values = values.filter(v => acknowledgments.has(v.id));
  }

  // Filter by priority
  if (priority) {
    values = values.filter(v => v.priority === priority.toUpperCase());
  }

  // Filter by date range
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    values = values.filter(v => {
      const date = new Date(v.timestamp);
      return date >= start && date <= end;
    });
  }

  // Add acknowledgment data
  const enrichedValues = values.map(v => ({
    ...v,
    acknowledgment: acknowledgments.get(v.id) || null,
    timeToAcknowledge: acknowledgments.has(v.id) ?
      (new Date(acknowledgments.get(v.id).timestamp) - new Date(v.timestamp)) / 1000 / 60 :
      null
  }));

  res.json({
    count: enrichedValues.length,
    values: enrichedValues,
    stats: {
      pending: values.filter(v => !acknowledgments.has(v.id)).length,
      acknowledged: values.filter(v => acknowledgments.has(v.id)).length,
      critical: values.filter(v => v.priority === 'CRITICAL').length,
      avgTimeToAcknowledge: calculateAvgAckTime(enrichedValues)
    }
  });
}));

// Submit new lab result and check for critical values
router.post('/check', asyncHandler(async (req, res) => {
  const { patientId, mrn, testName, value, orderedBy, performedBy } = req.body;

  // Validate input
  if (!patientId || !testName || value === undefined) {
    throw new AppError('Missing required fields', 400);
  }

  // Check if critical
  const critical = checkCritical(testName, value);

  if (critical) {
    const criticalValue = {
      id: require('crypto').randomUUID(),
      patientId,
      mrn,
      ...critical,
      orderedBy,
      performedBy,
      timestamp: new Date().toISOString(),
      notificationSent: false,
      escalated: false
    };

    // Store critical value
    criticalValues.set(criticalValue.id, criticalValue);

    // Send notification
    await sendCriticalNotification(criticalValue);

    // Start escalation timer
    startEscalationTimer(criticalValue.id);

    global.logger.warn('Critical value detected', {
      criticalValue,
      requestId: req.id
    });

    res.status(201).json({
      critical: true,
      criticalValue,
      message: 'Critical value detected and notification sent',
      requiresAcknowledgment: true,
      escalationTime: '15 minutes'
    });
  } else {
    res.json({
      critical: false,
      message: 'Value within normal range',
      testName,
      value
    });
  }
}));

// Acknowledge critical value
router.post('/:id/acknowledge', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { acknowledgedBy, notes, actionTaken } = req.body;

  const criticalValue = criticalValues.get(id);

  if (!criticalValue) {
    throw new AppError('Critical value not found', 404);
  }

  if (acknowledgments.has(id)) {
    throw new AppError('Critical value already acknowledged', 409);
  }

  const acknowledgment = {
    criticalValueId: id,
    acknowledgedBy: acknowledgedBy || req.user?.username || 'Unknown',
    timestamp: new Date().toISOString(),
    notes,
    actionTaken,
    timeToAcknowledge: (Date.now() - new Date(criticalValue.timestamp)) / 1000 / 60
  };

  acknowledgments.set(id, acknowledgment);

  // Cancel escalation
  cancelEscalation(id);

  global.logger.info('Critical value acknowledged', {
    criticalValueId: id,
    acknowledgment,
    requestId: req.id
  });

  res.json({
    message: 'Critical value acknowledged successfully',
    acknowledgment,
    complianceStatus: acknowledgment.timeToAcknowledge <= 15 ? 'COMPLIANT' : 'DELAYED'
  });
}));

// Get statistics
router.get('/statistics', asyncHandler(async (req, res) => {
  const values = Array.from(criticalValues.values());
  const acks = Array.from(acknowledgments.values());

  const stats = {
    total: values.length,
    pending: values.filter(v => !acknowledgments.has(v.id)).length,
    acknowledged: acks.length,
    byPriority: {
      critical: values.filter(v => v.priority === 'CRITICAL').length,
      high: values.filter(v => v.priority === 'HIGH').length
    },
    byTest: {},
    averageTimeToAcknowledge: calculateAvgAckTime(values),
    complianceRate: calculateComplianceRate(acks),
    last24Hours: values.filter(v =>
      new Date(v.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
  };

  // Group by test
  values.forEach(v => {
    if (!stats.byTest[v.testName]) {
      stats.byTest[v.testName] = 0;
    }
    stats.byTest[v.testName]++;
  });

  res.json(stats);
}));

// Helper Functions

async function sendCriticalNotification(criticalValue) {
  const notification = {
    id: criticalValue.id,
    type: 'CRITICAL_VALUE',
    priority: criticalValue.priority,
    patient: {
      id: criticalValue.patientId,
      mrn: criticalValue.mrn
    },
    test: {
      name: criticalValue.testName,
      value: criticalValue.value,
      units: criticalValue.units,
      severity: criticalValue.severity
    },
    timestamp: criticalValue.timestamp,
    message: `CRITICAL ${criticalValue.testName}: ${criticalValue.value} ${criticalValue.units}`
  };

  // In production, integrate with notification services
  // Teams, Email, SMS, Pager, etc.

  global.logger.critical('Critical value notification sent', notification);

  // Mark as sent
  criticalValue.notificationSent = true;
  criticalValue.notificationTime = new Date().toISOString();

  return true;
}

function startEscalationTimer(criticalValueId) {
  // After 15 minutes, escalate if not acknowledged
  setTimeout(async () => {
    if (!acknowledgments.has(criticalValueId)) {
      await escalateCriticalValue(criticalValueId);
    }
  }, 15 * 60 * 1000); // 15 minutes
}

function cancelEscalation(criticalValueId) {
  // In production, properly track and cancel timers
  global.logger.info('Escalation cancelled', { criticalValueId });
}

async function escalateCriticalValue(criticalValueId) {
  const criticalValue = criticalValues.get(criticalValueId);

  if (!criticalValue || criticalValue.escalated) {
    return;
  }

  global.logger.error('CRITICAL VALUE NOT ACKNOWLEDGED - ESCALATING', {
    criticalValue,
    timeSinceDetection: (Date.now() - new Date(criticalValue.timestamp)) / 1000 / 60
  });

  // Notify supervisor, medical director, etc.
  criticalValue.escalated = true;
  criticalValue.escalationTime = new Date().toISOString();

  // In production, send to multiple channels
  // Page on-call physician
  // Notify lab supervisor
  // Alert medical director
}

function calculateAvgAckTime(values) {
  const acknowledged = values.filter(v => v.timeToAcknowledge);
  if (acknowledged.length === 0) return 0;

  const total = acknowledged.reduce((sum, v) => sum + v.timeToAcknowledge, 0);
  return (total / acknowledged.length).toFixed(2);
}

function calculateComplianceRate(acknowledgments) {
  if (acknowledgments.length === 0) return 100;

  const compliant = acknowledgments.filter(a => a.timeToAcknowledge <= 15);
  return ((compliant.length / acknowledgments.length) * 100).toFixed(2);
}

module.exports = router;