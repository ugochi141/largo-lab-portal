# Environment Setup Guide
**Kaiser Permanente Largo Laboratory Portal**

## Quick Start

### 1. Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

### 2. Generate Secure Secrets

```bash
# Generate a secure JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Or use the built-in generator
node -e "const validator = require('./server/config/env-validator'); console.log('JWT_SECRET=' + validator.generateSecret(64))"
```

### 3. Configure Required Variables

Edit `.env` and set the following **required** variables:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=<your-generated-secret-from-step-2>
```

### 4. Validate Configuration

```bash
# Run the environment validator
node -e "require('./server/config/env-validator').validate()"
```

---

## Environment Variables Reference

### Server Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | ✅ | `development` | Environment mode: `development`, `staging`, `production` |
| `PORT` | Production only | `3000` | Server port number |

### Security & Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | ✅ | - | Secret key for JWT token signing (min 32 chars, recommended 64+) |
| `JWT_EXPIRE` | ❌ | `7d` | JWT token expiration time (e.g., `7d`, `24h`, `60m`) |
| `ALLOWED_ORIGINS` | Production only | `http://localhost:3000` | Comma-separated list of allowed CORS origins |

**Security Best Practices:**
- Never use default/weak JWT secrets in production
- Generate secrets using cryptographically secure random generators
- Rotate secrets periodically (recommended: every 90 days)
- Store secrets in secure vaults (AWS Secrets Manager, Azure Key Vault, etc.)

### Email Configuration (SMTP)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | Production only | `smtp.kp.org` | SMTP server hostname |
| `SMTP_PORT` | ❌ | `587` | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | Production only | - | SMTP authentication username |
| `SMTP_PASS` | Production only | - | SMTP authentication password |

**Email Features:**
- Automated inventory order emails
- Critical stock alerts
- System notifications
- Audit reports

### Error Tracking (Sentry)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SENTRY_DSN` | Production only | - | Sentry Data Source Name for error tracking |

**Setup:**
1. Create account at [sentry.io](https://sentry.io)
2. Create new project for "Node.js"
3. Copy DSN from project settings
4. Paste into `.env` file

**Benefits:**
- Real-time error monitoring
- Performance tracking
- Release tracking
- User impact analysis

### External Integrations (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EPIC_API_URL` | ❌ | - | Epic Beaker LIS API endpoint |
| `EPIC_API_KEY` | ❌ | - | Epic API authentication key |
| `BIORAD_API_URL` | ❌ | - | Bio-Rad Unity API endpoint |
| `BIORAD_API_KEY` | ❌ | - | Bio-Rad API authentication key |

### Database Configuration (Future)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | ❌ | `localhost` | PostgreSQL host |
| `DB_PORT` | ❌ | `5432` | PostgreSQL port |
| `DB_NAME` | ❌ | `largo_lab_portal` | Database name |
| `DB_USER` | ❌ | `postgres` | Database username |
| `DB_PASSWORD` | ❌ | - | Database password |
| `DB_SSL` | ❌ | `true` | Enable SSL connection |

### Redis Configuration (Future)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_HOST` | ❌ | `localhost` | Redis host |
| `REDIS_PORT` | ❌ | `6379` | Redis port |
| `REDIS_PASSWORD` | ❌ | - | Redis password |
| `REDIS_TLS` | ❌ | `false` | Enable TLS connection |

### Build Information (CI/CD)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BUILD_DATE` | ❌ | - | Build timestamp (ISO 8601 format) |
| `COMMIT_HASH` | ❌ | - | Git commit SHA |

---

## Environment-Specific Configurations

### Development Environment

**Minimal `.env` for local development:**

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-not-for-production-12345678901234567890
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Features:**
- Hot reloading enabled
- Verbose logging
- Mock data allowed
- CORS relaxed
- No Sentry required

### Staging Environment

**Recommended `.env` for staging:**

```env
NODE_ENV=staging
PORT=3000
JWT_SECRET=<generated-64-char-secret>
JWT_EXPIRE=7d
ALLOWED_ORIGINS=https://staging.largo-lab.kp.org
SENTRY_DSN=<your-sentry-dsn>
SMTP_HOST=smtp.kp.org
SMTP_PORT=587
SMTP_USER=largo-lab-staging@kp.org
SMTP_PASS=<smtp-password>
```

**Features:**
- Production-like environment
- Sentry enabled
- Email enabled (test recipients)
- Audit logging enabled
- Performance monitoring

### Production Environment

**Required `.env` for production:**

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<strong-64-char-secret>
JWT_EXPIRE=7d
ALLOWED_ORIGINS=https://largo-lab.kp.org,https://api.largo-lab.kp.org
SENTRY_DSN=<your-sentry-dsn>
SMTP_HOST=smtp.kp.org
SMTP_PORT=587
SMTP_USER=largo-lab-portal@kp.org
SMTP_PASS=<smtp-password>

# Optional but recommended
EPIC_API_URL=<epic-api-url>
EPIC_API_KEY=<epic-api-key>
BIORAD_API_URL=<biorad-api-url>
BIORAD_API_KEY=<biorad-api-key>
```

**Security Requirements:**
- All secrets must be strong and unique
- No default values allowed
- HTTPS only for ALLOWED_ORIGINS
- Sentry required for monitoring
- SMTP configured for notifications
- Regular secret rotation
- Secrets stored in vault (AWS/Azure)

---

## Secrets Management

### Using GitHub Secrets (GitHub Actions)

1. Go to repository Settings → Secrets and variables → Actions
2. Add each secret individually:
   - `JWT_SECRET`
   - `SENTRY_DSN`
   - `SMTP_PASS`
   - etc.

3. Reference in workflow:
```yaml
env:
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
```

### Using AWS Secrets Manager

```bash
# Store secret
aws secretsmanager create-secret \
    --name largo-lab/production/jwt-secret \
    --secret-string "your-secret-here"

# Retrieve secret
aws secretsmanager get-secret-value \
    --secret-id largo-lab/production/jwt-secret \
    --query SecretString \
    --output text
```

### Using Azure Key Vault

```bash
# Store secret
az keyvault secret set \
    --vault-name largo-lab-vault \
    --name jwt-secret \
    --value "your-secret-here"

# Retrieve secret
az keyvault secret show \
    --vault-name largo-lab-vault \
    --name jwt-secret \
    --query value \
    --output tsv
```

### Using 1Password CLI

```bash
# Store secret
op item create \
    --category=password \
    --title="Largo Lab JWT Secret" \
    password="your-secret-here"

# Retrieve secret
op item get "Largo Lab JWT Secret" --fields password
```

---

## Validation & Testing

### Manual Validation

```bash
# Check environment configuration
node -e "require('./server/config/env-validator').validate()"
```

Expected output:
```
🔍 Validating environment configuration...

✅ Environment configuration is valid
```

### Automated Validation (Package Script)

Add to `package.json`:
```json
{
  "scripts": {
    "validate:env": "node -e \"require('./server/config/env-validator').validate()\"",
    "prestart": "npm run validate:env"
  }
}
```

Run validation:
```bash
npm run validate:env
```

### Environment Summary

```bash
node -e "console.log(require('./server/config/env-validator').getSummary())"
```

Expected output:
```json
{
  "nodeEnv": "development",
  "port": "3000",
  "jwtConfigured": true,
  "sentryConfigured": true,
  "smtpConfigured": true,
  "corsConfigured": true,
  "databaseConfigured": false,
  "redisConfigured": false
}
```

---

## Troubleshooting

### Error: "Missing required environment variable: JWT_SECRET"

**Solution:**
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to .env
echo "JWT_SECRET=<generated-secret>" >> .env
```

### Error: "JWT_SECRET is using a weak/default value"

**Solution:**
- Never use example/default values in production
- Generate a new secret using the command above
- Update `.env` with the new secret
- Restart the server

### Warning: "Partial SMTP configuration detected"

**Solution:**
- Set all three SMTP variables: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- Or remove all SMTP variables if email is not needed

### Error: "ALLOWED_ORIGINS cannot use wildcard (*) in production"

**Solution:**
```env
# Bad
ALLOWED_ORIGINS=*

# Good
ALLOWED_ORIGINS=https://largo-lab.kp.org,https://api.largo-lab.kp.org
```

### Port Already in Use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

---

## Security Checklist

Before deploying to production, verify:

- [ ] All secrets are strong and randomly generated
- [ ] No default/example values in `.env`
- [ ] `.env` is in `.gitignore` (never committed)
- [ ] Secrets are stored in secure vault
- [ ] HTTPS enforced for all origins
- [ ] Sentry DSN configured for error tracking
- [ ] SMTP credentials tested and working
- [ ] Environment validation passes without errors
- [ ] No warnings in validation output
- [ ] Secrets rotation schedule established
- [ ] Access to secrets is role-based and audited

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Create .env file
        run: |
          echo "NODE_ENV=production" >> .env
          echo "PORT=${{ secrets.PORT }}" >> .env
          echo "JWT_SECRET=${{ secrets.JWT_SECRET }}" >> .env
          echo "SENTRY_DSN=${{ secrets.SENTRY_DSN }}" >> .env
          echo "ALLOWED_ORIGINS=${{ secrets.ALLOWED_ORIGINS }}" >> .env
          echo "SMTP_HOST=${{ secrets.SMTP_HOST }}" >> .env
          echo "SMTP_USER=${{ secrets.SMTP_USER }}" >> .env
          echo "SMTP_PASS=${{ secrets.SMTP_PASS }}" >> .env

      - name: Validate environment
        run: npm run validate:env

      - name: Deploy
        run: ./deploy.sh
```

---

## Additional Resources

- [dotenv documentation](https://github.com/motdotla/dotenv)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Sentry Documentation](https://docs.sentry.io/)

---

**Last Updated:** November 3, 2025
**Version:** 1.0
**Maintainer:** Largo Laboratory IT Team
