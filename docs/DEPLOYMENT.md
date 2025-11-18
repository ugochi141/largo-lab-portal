# Deployment Guide
**Kaiser Permanente Largo Laboratory Portal**
**Version:** 3.0.0
**Last Updated:** November 3, 2025

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Deployment Methods](#deployment-methods)
4. [Production Deployment](#production-deployment)
5. [Rollback Procedures](#rollback-procedures)
6. [Health Checks](#health-checks)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing (`npm test`)
- [ ] Linting passes with zero errors (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] No console errors in development preview (`npm run preview`)

### Security

- [ ] npm audit shows 0 critical/high vulnerabilities
- [ ] Environment variables are set correctly
- [ ] No secrets in source code
- [ ] `.env` files are in `.gitignore`
- [ ] HTTPS enforced in production
- [ ] CORS origins configured correctly

### Documentation

- [ ] CHANGELOG updated with release notes
- [ ] README reflects current state
- [ ] API documentation current (if applicable)
- [ ] Environment variables documented

### Compliance

- [ ] HIPAA audit logging enabled
- [ ] Sentry error tracking configured
- [ ] Log retention meets compliance requirements (7 years)
- [ ] PHI data sanitization verified

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/ugochi141/largo-lab-portal.git
cd largo-lab-portal-project
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with production values
nano .env
```

**Required Variables:**
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<generated-64-char-secret>
SENTRY_DSN=<your-sentry-dsn>
VITE_SENTRY_DSN=<your-sentry-dsn>
ALLOWED_ORIGINS=https://largo-lab.kp.org
SMTP_HOST=smtp.kp.org
SMTP_USER=largo-lab-portal@kp.org
SMTP_PASS=<smtp-password>
```

### 4. Validate Configuration

```bash
# Validate environment variables
node -e "require('./server/config/env-validator').validate()"
```

---

## Deployment Methods

### Method 1: GitHub Pages (Static Frontend Only)

**Use Case:** Static HTML deployment without backend

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

**Configuration:**
- Branch: `gh-pages`
- URL: `https://ugochi141.github.io/largo-lab-portal/`

### Method 2: Node.js Server (Full Stack)

**Use Case:** Complete application with backend API

#### Option A: PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Build frontend
npm run build

# Start with PM2
pm2 start server/index.js --name largo-lab-portal

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

#### Option B: Systemd Service

```bash
# Create systemd service file
sudo nano /etc/systemd/system/largo-lab-portal.service
```

```ini
[Unit]
Description=Largo Laboratory Portal
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/largo-lab-portal
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=largo-lab-portal

Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable largo-lab-portal
sudo systemctl start largo-lab-portal

# Check status
sudo systemctl status largo-lab-portal
```

### Method 3: Docker Deployment

**Use Case:** Containerized deployment

```bash
# Build Docker image
docker build -t largo-lab-portal:3.0.0 .

# Run container
docker run -d \
  --name largo-lab-portal \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  largo-lab-portal:3.0.0
```

### Method 4: Cloud Deployment

#### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init largo-lab-portal --platform node.js --region us-east-1

# Create environment
eb create largo-lab-production

# Deploy
eb deploy
```

#### Azure App Service

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Create resource group
az group create --name largo-lab-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name largo-lab-plan \
  --resource-group largo-lab-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group largo-lab-rg \
  --plan largo-lab-plan \
  --name largo-lab-portal \
  --runtime "NODE|18-lts"

# Deploy code
az webapp up \
  --name largo-lab-portal \
  --resource-group largo-lab-rg
```

---

## Production Deployment

### Step-by-Step Production Deploy

#### 1. Pre-flight Checks

```bash
# Pull latest code
git fetch origin
git checkout main
git pull origin main

# Install dependencies
npm ci  # Clean install for production

# Run tests
npm test

# Security audit
npm audit

# Lint code
npm run lint

# Type check
npm run type-check
```

#### 2. Build Application

```bash
# Build frontend
npm run build

# Verify build
npm run preview
# Open http://localhost:4173 and test
```

#### 3. Backup Current Version

```bash
# Backup current deployment
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz dist/ server/ package.json

# Upload backup to safe location
aws s3 cp backup-*.tar.gz s3://largo-lab-backups/
```

#### 4. Deploy New Version

**Using PM2:**
```bash
# Stop current instance
pm2 stop largo-lab-portal

# Deploy new code
cp -r dist/ /var/www/largo-lab-portal/
cp -r server/ /var/www/largo-lab-portal/

# Restart with zero downtime
pm2 reload largo-lab-portal

# Verify deployment
pm2 logs largo-lab-portal --lines 50
```

**Using Systemd:**
```bash
# Stop service
sudo systemctl stop largo-lab-portal

# Deploy new code
sudo cp -r dist/ /var/www/largo-lab-portal/
sudo cp -r server/ /var/www/largo-lab-portal/

# Start service
sudo systemctl start largo-lab-portal

# Check status
sudo systemctl status largo-lab-portal
```

#### 5. Post-Deployment Verification

```bash
# Check health endpoint
curl https://largo-lab.kp.org/health

# Check application logs
pm2 logs largo-lab-portal --lines 100

# Monitor error tracking
# Visit Sentry dashboard

# Verify critical features
# - Login functionality
# - Schedule viewing
# - Equipment tracking
# - Inventory management
```

#### 6. Monitor for Issues

```bash
# Monitor logs for 10 minutes
pm2 logs largo-lab-portal --raw | tee deployment-$(date +%Y%m%d).log

# Check error rates in Sentry
# Check server resources
pm2 monit
```

---

## Rollback Procedures

### Quick Rollback (PM2)

```bash
# Stop current version
pm2 stop largo-lab-portal

# Restore from backup
tar -xzf backup-YYYYMMDD-HHMMSS.tar.gz -C /var/www/largo-lab-portal/

# Restart previous version
pm2 restart largo-lab-portal

# Verify rollback
pm2 logs largo-lab-portal --lines 50
```

### Git-based Rollback

```bash
# Find previous working commit
git log --oneline -n 10

# Checkout previous version
git checkout <previous-commit-hash>

# Rebuild
npm ci
npm run build

# Deploy
pm2 reload largo-lab-portal
```

### Database Rollback (if applicable)

```bash
# Restore database from backup
pg_restore -d largo_lab_portal backup.dump

# Or rollback specific migration
npm run migrate:rollback
```

---

## Health Checks

### Application Health Endpoints

#### Basic Health Check
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-03T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

#### Detailed Health Check
```bash
curl http://localhost:3000/health/detailed
```

**Expected Response:**
```json
{
  "status": "healthy",
  "checks": {
    "database": "connected",
    "redis": "connected",
    "disk": "ok",
    "memory": "ok"
  },
  "version": "3.0.0",
  "integrations": {
    "epicBeaker": "configured",
    "bioRadUnity": "configured"
  }
}
```

### System Health Checks

```bash
# Check disk space
df -h

# Check memory
free -m

# Check CPU
top -bn1 | head -20

# Check network
netstat -tuln | grep 3000
```

---

## Monitoring

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Process list
pm2 list

# Logs
pm2 logs largo-lab-portal

# Flush logs
pm2 flush
```

### Log Monitoring

```bash
# Application logs
tail -f logs/application-$(date +%Y-%m-%d).log

# Error logs
tail -f logs/error-$(date +%Y-%m-%d).log

# Audit logs
tail -f logs/audit-$(date +%Y-%m-%d).log
```

### Sentry Monitoring

- Dashboard: https://sentry.io/organizations/your-org/projects/largo-lab-portal/
- Real-time errors
- Performance metrics
- Release tracking

---

## Troubleshooting

### Application Won't Start

**Check logs:**
```bash
pm2 logs largo-lab-portal --err
```

**Common causes:**
- Missing environment variables
- Port already in use
- Insufficient permissions
- Missing dependencies

**Solutions:**
```bash
# Validate environment
node -e "require('./server/config/env-validator').validate()"

# Check port availability
lsof -i :3000

# Fix permissions
sudo chown -R www-data:www-data /var/www/largo-lab-portal

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart with memory limit
pm2 restart largo-lab-portal --max-memory-restart 500M

# Analyze heap dump
node --inspect server/index.js
```

### Slow Performance

```bash
# Enable profiling
NODE_OPTIONS="--prof" pm2 restart largo-lab-portal

# Analyze profile
node --prof-process isolate-*.log > profile.txt

# Check database connections
# Check Redis cache hit rate
# Review Sentry performance metrics
```

### Database Connection Issues

```bash
# Test database connection
psql -h localhost -U postgres -d largo_lab_portal

# Check connection pool
# Review database logs
tail -f /var/log/postgresql/postgresql-*.log
```

---

## Automated Deployment (CI/CD)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

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

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/largo-lab-portal
            git pull origin main
            npm ci
            npm run build
            pm2 reload largo-lab-portal
```

---

## Security Considerations

### SSL/TLS Certificate

```bash
# Install certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d largo-lab.kp.org

# Auto-renewal
sudo certbot renew --dry-run
```

### Firewall Configuration

```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if needed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### Rate Limiting (Nginx)

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api burst=20;
    }
}
```

---

## Support Contacts

- **IT Support:** support@kp.org
- **Emergency:** 1-800-KP-HELPDESK
- **On-call:** See on-call schedule

---

**Classification:** INTERNAL USE ONLY
**Distribution:** IT Operations, DevOps Team, System Administrators
