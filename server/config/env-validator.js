/**
 * Environment Variable Validator
 * Validates required environment variables on server startup
 * Kaiser Permanente Largo Laboratory Portal
 */

const crypto = require('crypto');

class EnvironmentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.requiredVars = {
      production: [
        'NODE_ENV',
        'PORT',
        'JWT_SECRET',
        'SENTRY_DSN',
        'ALLOWED_ORIGINS',
        'SMTP_HOST',
        'SMTP_USER',
        'SMTP_PASS'
      ],
      development: [
        'NODE_ENV',
        'JWT_SECRET'
      ]
    };
  }

  /**
   * Validate all environment variables
   */
  validate() {
    const env = process.env.NODE_ENV || 'development';

    console.log('\n🔍 Validating environment configuration...\n');

    // Check required variables
    this.checkRequiredVariables(env);

    // Security checks
    this.validateJWTSecret();
    this.validateCORS();
    this.validateSMTP();

    // Display results
    this.displayResults();

    // Exit if errors in production
    if (env === 'production' && this.errors.length > 0) {
      console.error('\n❌ Environment validation failed. Server cannot start in production with configuration errors.\n');
      process.exit(1);
    }

    // Warning in development
    if (env === 'development' && this.errors.length > 0) {
      console.warn('\n⚠️  Environment validation found issues. Server will start but may not function correctly.\n');
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * Check required variables exist
   */
  checkRequiredVariables(env) {
    const required = this.requiredVars[env] || this.requiredVars.development;

    required.forEach(varName => {
      if (!process.env[varName]) {
        this.errors.push(`Missing required environment variable: ${varName}`);
      }
    });
  }

  /**
   * Validate JWT secret
   */
  validateJWTSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      this.errors.push('JWT_SECRET is not set');
      return;
    }

    // Check for default/weak secrets
    const weakSecrets = [
      'secret',
      'default',
      'change-me',
      'default-secret-change-in-production',
      'your-super-secret-jwt-key-change-this-in-production'
    ];

    if (weakSecrets.includes(secret)) {
      if (process.env.NODE_ENV === 'production') {
        this.errors.push('JWT_SECRET is using a weak/default value. Generate a strong secret.');
      } else {
        this.warnings.push('JWT_SECRET is using a weak/default value. Acceptable in development, but change for production.');
      }
    }

    // Check secret length
    if (secret.length < 32) {
      this.warnings.push(`JWT_SECRET is too short (${secret.length} chars). Recommended: 64+ characters.`);
    }
  }

  /**
   * Validate CORS configuration
   */
  validateCORS() {
    const origins = process.env.ALLOWED_ORIGINS;

    if (!origins && process.env.NODE_ENV === 'production') {
      this.errors.push('ALLOWED_ORIGINS must be set in production');
      return;
    }

    if (origins) {
      const originList = origins.split(',').map(o => o.trim());

      // Check for wildcard in production
      if (process.env.NODE_ENV === 'production' && originList.includes('*')) {
        this.errors.push('ALLOWED_ORIGINS cannot use wildcard (*) in production');
      }

      // Validate URL format
      originList.forEach(origin => {
        if (origin !== '*' && !origin.startsWith('http://') && !origin.startsWith('https://')) {
          this.warnings.push(`ALLOWED_ORIGINS entry may be invalid: ${origin}`);
        }
      });
    }
  }

  /**
   * Validate SMTP configuration
   */
  validateSMTP() {
    const smtpVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
    const missing = smtpVars.filter(v => !process.env[v]);

    if (missing.length > 0 && missing.length < smtpVars.length) {
      this.warnings.push(`Partial SMTP configuration detected. Missing: ${missing.join(', ')}`);
    }

    if (process.env.SMTP_PORT) {
      const port = parseInt(process.env.SMTP_PORT);
      if (isNaN(port) || port < 1 || port > 65535) {
        this.errors.push(`SMTP_PORT is invalid: ${process.env.SMTP_PORT}`);
      }
    }
  }

  /**
   * Display validation results
   */
  displayResults() {
    // Show errors
    if (this.errors.length > 0) {
      console.error('❌ ERRORS:');
      this.errors.forEach(error => {
        console.error(`   - ${error}`);
      });
      console.error('');
    }

    // Show warnings
    if (this.warnings.length > 0) {
      console.warn('⚠️  WARNINGS:');
      this.warnings.forEach(warning => {
        console.warn(`   - ${warning}`);
      });
      console.warn('');
    }

    // Show success
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ Environment configuration is valid\n');
    } else if (this.errors.length === 0) {
      console.log(`✅ Environment configuration is valid (${this.warnings.length} warnings)\n`);
    }
  }

  /**
   * Generate a secure random secret
   */
  static generateSecret(length = 64) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Get environment summary
   */
  static getSummary() {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '3000',
      jwtConfigured: !!process.env.JWT_SECRET,
      sentryConfigured: !!process.env.SENTRY_DSN,
      smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
      corsConfigured: !!process.env.ALLOWED_ORIGINS,
      databaseConfigured: !!(process.env.DB_HOST && process.env.DB_NAME),
      redisConfigured: !!process.env.REDIS_HOST
    };
  }
}

// Export validator
module.exports = {
  EnvironmentValidator,
  validate: () => new EnvironmentValidator().validate(),
  generateSecret: EnvironmentValidator.generateSecret,
  getSummary: EnvironmentValidator.getSummary
};
