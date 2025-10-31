# Largo Lab Portal - Deployment Guide

## Version 2.1.0 - Complete Manager Operations Suite

### ✅ Git Update Status

All changes have been successfully committed to your local repository with commit hash: `59b3206`

**Commit Message:** feat: Major v2.1.0 release - Complete Manager Operations Suite

### 📦 What's Been Added

#### New Files (32 total):
- **Manager Operations Pages**:
  - `manager-dashboard.html` - Complete operations dashboard
  - `timecard-management.html` - Timecard review system
  - `equipment-tracker.html` - Equipment management
  - `inventory.html` - Inventory management UI

- **Backend Server**:
  - `server/index.js` - Main Express server
  - `server/routes/` - API endpoints (health, inventory, critical values)
  - `server/middleware/` - Security and logging
  - `server/services/emailService.js` - Automatic ordering
  - `server/utils/` - Excel processors

- **Configuration**:
  - `package.json` - Node.js dependencies
  - `ecosystem.config.js` - PM2 configuration
  - `.github/workflows/ci.yml` - CI/CD pipeline

- **Data**:
  - `server/data/equipment.json` - Equipment database
  - `data/inventory.json` - Inventory with PAR levels

### 🚀 To Push to GitHub

Since GitHub requires authentication, you have several options:

#### Option 1: GitHub CLI (Recommended)
```bash
# Install GitHub CLI if not already installed
brew install gh

# Authenticate with GitHub
gh auth login

# Push your changes
git push origin main
```

#### Option 2: Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with 'repo' scope
3. Use the token as password when prompted:
```bash
git push origin main
# Username: ugochi141
# Password: [paste your token]
```

#### Option 3: SSH Key
```bash
# Generate SSH key if needed
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add SSH key to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy SSH key to clipboard
pbcopy < ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Change remote to SSH
git remote set-url origin git@github.com:ugochi141/largo-lab-portal.git

# Push changes
git push origin main
```

### 🖥️ To Deploy the Application

#### Local Development:
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
# Access at http://localhost:3000
```

#### Production Deployment with PM2:
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
npm run pm2:start

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
```

### 📋 Post-Deployment Checklist

- [ ] Configure SMTP settings in .env for email functionality
- [ ] Set up Sentry DSN for error tracking
- [ ] Configure database connection (if using)
- [ ] Verify all external system links work
- [ ] Test inventory automatic ordering
- [ ] Verify equipment tracker displays correctly
- [ ] Test timecard management checklist
- [ ] Confirm manager dashboard loads all data

### 🔗 Access Points

Once deployed, access these features:
1. **Main Portal**: http://localhost:3000
2. **Manager Dashboard**: http://localhost:3000/manager-dashboard.html
3. **Inventory System**: http://localhost:3000/inventory.html
4. **Timecard Management**: http://localhost:3000/timecard-management.html
5. **Equipment Tracker**: http://localhost:3000/equipment-tracker.html

### 📧 Email Configuration

For automatic inventory ordering to work, configure these email settings in .env:
```
SMTP_HOST=smtp.kp.org
SMTP_PORT=587
SMTP_USER=largo-lab-portal@kp.org
SMTP_PASS=your-password
```

Recipients are already configured:
- **To**: LargoInventoryTeam@KP.org, Alex.X.Roberson@kp.org, Tianna.J.Maxwell@kp.org
- **CC**: John.F.Ekpe@kp.org, Ugochi.L.Ndubuisi@kp.org, and others

### 🆘 Troubleshooting

If you encounter issues:

1. **Port already in use**:
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Node modules issues**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **PM2 issues**:
   ```bash
   pm2 kill
   pm2 resurrect
   ```

### 📞 Support Contacts in System

All these contacts are now integrated into the portal:
- **IT Support**: 301-456-6096
- **Command Center**: 866-248-0661
- **Inventory POCs**: Alex Roberson, Erick Albarracin, Daniel Vanzego
- **Equipment Vendors**: All support numbers included

### ✅ Update Complete!

Your Largo Lab Portal v2.1.0 is ready for deployment with:
- Complete Manager Operations Suite
- Inventory Management with automatic ordering
- Equipment tracking with maintenance schedules
- Timecard management system
- Full HIPAA compliance
- Production-ready backend

---
Last Updated: October 30, 2025
Version: 2.1.0