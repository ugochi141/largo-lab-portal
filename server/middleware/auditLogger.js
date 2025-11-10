/**
 * HIPAA Audit Logger Middleware
 * Tracks all PHI access and modifications for compliance
 * Retention: 7 years per HIPAA requirements
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// PHI-related endpoints that require audit logging
const PHI_ENDPOINTS = [
  '/api/patients',
  '/api/lab-results',
  '/api/critical-values',
  '/api/test-orders',
  '/api/medical-records'
];

// Determine if request accesses PHI
const accessesPHI = (req) => {
  return PHI_ENDPOINTS.some(endpoint => req.path.startsWith(endpoint));
};

// Generate audit log entry
const createAuditEntry = (req, res, action) => {
  return {
    auditId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    user: {
      id: req.user?.id || 'anonymous',
      username: req.user?.username || 'anonymous',
      role: req.user?.role || 'none',
      department: req.user?.department || 'unknown'
    },
    action: action || determineAction(req.method),
    resource: {
      type: determineResourceType(req.path),
      path: req.path,
      id: extractResourceId(req)
    },
    request: {
      id: req.id,
      method: req.method,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      sessionId: req.session?.id
    },
    response: {
      statusCode: res.statusCode,
      success: res.statusCode < 400
    },
    dataAccessed: extractAccessedData(req, res),
    hipaaClassification: classifyHIPAAAccess(req, res),
    retention: {
      required: true,
      untilDate: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString() // 7 years
    }
  };
};

// Determine action type from HTTP method
const determineAction = (method) => {
  const actions = {
    'GET': 'READ',
    'POST': 'CREATE',
    'PUT': 'UPDATE',
    'PATCH': 'MODIFY',
    'DELETE': 'DELETE'
  };
  return actions[method] || 'UNKNOWN';
};

// Extract resource type from path
const determineResourceType = (path) => {
  if (path.includes('patients')) return 'PATIENT_DATA';
  if (path.includes('lab-results')) return 'LAB_RESULTS';
  if (path.includes('critical-values')) return 'CRITICAL_VALUES';
  if (path.includes('test-orders')) return 'TEST_ORDERS';
  if (path.includes('medical-records')) return 'MEDICAL_RECORDS';
  return 'OTHER';
};

// Extract resource ID from request
const extractResourceId = (req) => {
  // Try params first
  if (req.params.id) return req.params.id;
  if (req.params.patientId) return req.params.patientId;
  if (req.params.mrn) return req.params.mrn;

  // Try query
  if (req.query.id) return req.query.id;
  if (req.query.patientId) return req.query.patientId;

  // Try body for POST/PUT
  if (req.body?.id) return req.body.id;
  if (req.body?.patientId) return req.body.patientId;

  return null;
};

// Extract what data was accessed (sanitized)
const extractAccessedData = (req, res) => {
  const accessed = {
    fields: [],
    recordCount: 0
  };

  // For GET requests, track what was returned
  if (req.method === 'GET' && res.locals.auditData) {
    accessed.fields = res.locals.auditData.fields || [];
    accessed.recordCount = res.locals.auditData.count || 0;
  }

  // For POST/PUT, track what was modified
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    accessed.fields = Object.keys(req.body).filter(key =>
      !['password', 'token', 'secret'].includes(key.toLowerCase())
    );
  }

  return accessed;
};

// Classify access type for HIPAA
const classifyHIPAAAccess = (req, res) => {
  // Treatment, Payment, Operations (TPO)
  const purpose = req.headers['x-access-purpose'] || 'operations';

  return {
    purpose: purpose,
    hasPatientConsent: req.headers['x-patient-consent'] === 'true',
    isEmergencyAccess: req.headers['x-emergency'] === 'true',
    isMinimumNecessary: true, // Should be validated by business logic
    requiresAccounting: !['treatment', 'payment', 'operations'].includes(purpose.toLowerCase())
  };
};

// Write audit log to file (backup to file system)
const writeAuditLog = async (entry) => {
  try {
    const logDir = path.join(process.cwd(), 'logs', 'audit');
    await fs.mkdir(logDir, { recursive: true });

    const fileName = `audit-${new Date().toISOString().split('T')[0]}.jsonl`;
    const filePath = path.join(logDir, fileName);

    await fs.appendFile(filePath, JSON.stringify(entry) + '\n');
  } catch (error) {
    console.error('Failed to write audit log to file:', error);
  }
};

// Main audit logger middleware
const auditLogger = async (req, res, next) => {
  // Skip if not accessing PHI
  if (!accessesPHI(req)) {
    return next();
  }

  // Capture response data for audit
  const originalSend = res.send;
  res.send = function (data) {
    res.locals.responseData = data;
    originalSend.call(this, data);
  };

  // Log after response
  res.on('finish', async () => {
    try {
      const auditEntry = createAuditEntry(req, res);

      // Log to Winston audit transport
      global.logger.info('HIPAA_AUDIT', auditEntry);

      // Also write to dedicated audit file
      await writeAuditLog(auditEntry);

      // Send to audit database if configured
      if (global.auditDb) {
        await global.auditDb.logAudit(auditEntry);
      }

      // Alert on suspicious activity
      if (shouldAlert(auditEntry)) {
        await sendSecurityAlert(auditEntry);
      }

    } catch (error) {
      // Never fail the request due to audit logging issues
      global.logger.error('Audit logging failed', {
        error: error.message,
        requestId: req.id
      });
    }
  });

  next();
};

// Determine if activity should trigger alert
const shouldAlert = (entry) => {
  // Alert on failed access to critical values
  if (entry.resource.type === 'CRITICAL_VALUES' && !entry.response.success) {
    return true;
  }

  // Alert on bulk data access
  if (entry.dataAccessed.recordCount > 100) {
    return true;
  }

  // Alert on access outside business hours (if not emergency)
  const hour = new Date().getHours();
  if ((hour < 6 || hour > 22) && !entry.hipaaClassification.isEmergencyAccess) {
    return true;
  }

  // Alert on unusual access patterns
  // This would normally check against historical patterns
  return false;
};

// Send security alert
const sendSecurityAlert = async (entry) => {
  global.logger.warn('SECURITY_ALERT', {
    message: 'Suspicious activity detected',
    auditEntry: entry,
    alertTime: new Date().toISOString()
  });

  // Send to security team
  // Implementation would include email/SMS/Teams notification
};

// Audit report generator
const generateAuditReport = async (startDate, endDate) => {
  // Read audit logs for date range
  const logs = [];
  // Implementation would read from audit log files

  return {
    period: { startDate, endDate },
    totalAccesses: logs.length,
    uniqueUsers: new Set(logs.map(l => l.user.id)).size,
    accessByType: {},
    criticalAccesses: logs.filter(l => l.resource.type === 'CRITICAL_VALUES'),
    failedAccesses: logs.filter(l => !l.response.success),
    emergencyAccesses: logs.filter(l => l.hipaaClassification.isEmergencyAccess),
    generatedAt: new Date().toISOString()
  };
};

module.exports = {
  auditLogger,
  generateAuditReport,
  createAuditEntry
};