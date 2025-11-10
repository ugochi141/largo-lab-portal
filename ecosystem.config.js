/**
 * PM2 Configuration for Production Deployment
 * Kaiser Permanente Largo Laboratory Portal
 */

module.exports = {
  apps: [{
    // Application Configuration
    name: 'largo-lab-portal',
    script: './server/index.js',
    instances: process.env.PM2_INSTANCES || 2, // Cluster mode for high availability
    exec_mode: 'cluster',
    max_restarts: 10,
    min_uptime: '10s',

    // Environment Variables
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3001,
      DEBUG: 'app:*'
    },

    // Logging Configuration
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    merge_logs: true,
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',

    // Advanced Features
    watch: false, // Set to true in development
    ignore_watch: [
      'node_modules',
      'logs',
      '.git',
      '*.log',
      'public',
      'uploads'
    ],

    // Auto-restart Configuration
    autorestart: true,
    max_memory_restart: '1G',
    cron_restart: '0 3 * * *', // Daily restart at 3 AM for memory cleanup

    // Graceful Shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,

    // Health Check & Monitoring
    health_check: {
      interval: 30000, // 30 seconds
      timeout: 5000,
      max_consecutive_failures: 3,
      path: '/health',
      port: 3000
    },

    // Deployment Signals
    shutdown_with_message: true,
    post_update: ['npm install', 'npm run build'],

    // Error Handling
    min_uptime: 5000,
    max_restarts: 10,

    // Node.js Flags
    node_args: '--max-old-space-size=2048',

    // Source Maps Support
    source_map_support: true,

    // Instance Variables (for cluster mode)
    instance_var: 'INSTANCE_ID',

    // Monitoring
    monitoring: true,
    trace: true
  }],

  // Deployment Configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['largo-lab-server-1', 'largo-lab-server-2'],
      ref: 'origin/main',
      repo: 'git@github.com:kaiserpermanente/largo-lab-portal.git',
      path: '/var/www/largo-lab-portal',
      'pre-deploy': 'git pull',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'npm install pm2 -g',
      ssh_options: 'StrictHostKeyChecking=no',
      env: {
        NODE_ENV: 'production'
      }
    },
    staging: {
      user: 'deploy',
      host: 'largo-lab-staging',
      ref: 'origin/develop',
      repo: 'git@github.com:kaiserpermanente/largo-lab-portal.git',
      path: '/var/www/largo-lab-portal-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging'
      }
    }
  },

  // Monitoring Configuration
  monitoring: {
    http: true,
    https: false,
    transactions: true,
    network: true,
    ports: true
  }
};

/**
 * PM2 Commands Reference:
 *
 * Start application:
 *   pm2 start ecosystem.config.js --env production
 *
 * Stop application:
 *   pm2 stop largo-lab-portal
 *
 * Restart application:
 *   pm2 restart largo-lab-portal
 *
 * Reload with zero downtime:
 *   pm2 reload largo-lab-portal
 *
 * View logs:
 *   pm2 logs largo-lab-portal
 *
 * Monitor:
 *   pm2 monit
 *
 * Save current process list:
 *   pm2 save
 *
 * Resurrect saved process list:
 *   pm2 resurrect
 *
 * Generate startup script:
 *   pm2 startup
 *
 * Deploy to production:
 *   pm2 deploy production
 *
 * Update PM2:
 *   pm2 update
 *
 * Health check status:
 *   pm2 show largo-lab-portal
 */