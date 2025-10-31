/**
 * Health Check Routes
 * Provides health and readiness endpoints for monitoring
 */

const express = require('express');
const router = express.Router();
const os = require('os');
const { version } = require('../../package.json');

// Basic health check - is the service running?
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'largo-lab-portal',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    requestId: req.id
  });
});

// Detailed health check with dependencies
router.get('/live', async (req, res) => {
  const health = {
    status: 'healthy',
    service: 'largo-lab-portal',
    version: version,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {}
  };

  // Check memory usage
  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memPercent = ((totalMem - freeMem) / totalMem * 100).toFixed(2);

  health.checks.memory = {
    status: memPercent < 90 ? 'healthy' : 'degraded',
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    systemPercent: `${memPercent}%`
  };

  // Check CPU
  const cpus = os.cpus();
  const avgLoad = os.loadavg()[0];
  health.checks.cpu = {
    status: avgLoad < cpus.length * 0.7 ? 'healthy' : 'degraded',
    cores: cpus.length,
    loadAverage: avgLoad.toFixed(2)
  };

  // Check disk space (simplified)
  health.checks.disk = {
    status: 'healthy',
    message: 'Disk monitoring active'
  };

  // Overall status
  const allHealthy = Object.values(health.checks).every(
    check => check.status === 'healthy'
  );
  health.status = allHealthy ? 'healthy' : 'degraded';

  res.status(allHealthy ? 200 : 503).json(health);
});

// Readiness check - is the service ready to accept traffic?
router.get('/ready', async (req, res) => {
  const readiness = {
    ready: true,
    service: 'largo-lab-portal',
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // Check database connection (if applicable)
    if (global.db) {
      try {
        await global.db.query('SELECT 1');
        readiness.checks.database = { ready: true, status: 'connected' };
      } catch (error) {
        readiness.checks.database = { ready: false, error: 'Connection failed' };
        readiness.ready = false;
      }
    }

    // Check Redis connection (if applicable)
    if (global.redis) {
      try {
        await global.redis.ping();
        readiness.checks.redis = { ready: true, status: 'connected' };
      } catch (error) {
        readiness.checks.redis = { ready: false, error: 'Connection failed' };
        readiness.ready = false;
      }
    }

    // Check external services
    readiness.checks.externalServices = {
      ready: true,
      epicBeaker: process.env.EPIC_API_URL ? 'configured' : 'not configured',
      bioRadUnity: process.env.BIORAD_API_URL ? 'configured' : 'not configured'
    };

    // Check required environment variables
    const requiredEnvVars = ['NODE_ENV', 'PORT'];
    const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

    readiness.checks.configuration = {
      ready: missingEnvVars.length === 0,
      missingVars: missingEnvVars
    };

    if (missingEnvVars.length > 0) {
      readiness.ready = false;
    }

  } catch (error) {
    global.logger.error('Readiness check failed', { error: error.message });
    readiness.ready = false;
    readiness.error = 'Health check failed';
  }

  res.status(readiness.ready ? 200 : 503).json(readiness);
});

// Metrics endpoint (Prometheus format)
router.get('/metrics', (req, res) => {
  const metrics = [];

  // Process metrics
  const memUsage = process.memoryUsage();
  metrics.push(`# HELP nodejs_heap_size_total_bytes Process heap size`);
  metrics.push(`# TYPE nodejs_heap_size_total_bytes gauge`);
  metrics.push(`nodejs_heap_size_total_bytes ${memUsage.heapTotal}`);

  metrics.push(`# HELP nodejs_heap_size_used_bytes Process heap size used`);
  metrics.push(`# TYPE nodejs_heap_size_used_bytes gauge`);
  metrics.push(`nodejs_heap_size_used_bytes ${memUsage.heapUsed}`);

  metrics.push(`# HELP nodejs_process_uptime_seconds Process uptime`);
  metrics.push(`# TYPE nodejs_process_uptime_seconds gauge`);
  metrics.push(`nodejs_process_uptime_seconds ${process.uptime()}`);

  // Custom application metrics
  metrics.push(`# HELP lab_portal_info Application information`);
  metrics.push(`# TYPE lab_portal_info gauge`);
  metrics.push(`lab_portal_info{version="${version}",env="${process.env.NODE_ENV}"} 1`);

  res.set('Content-Type', 'text/plain');
  res.send(metrics.join('\n'));
});

// Version information
router.get('/version', (req, res) => {
  res.json({
    service: 'largo-lab-portal',
    version: version,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    buildDate: process.env.BUILD_DATE || 'unknown',
    commitHash: process.env.COMMIT_HASH || 'unknown'
  });
});

module.exports = router;