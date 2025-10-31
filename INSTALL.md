# Installation Instructions - Largo Lab Portal v3.0

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js 18+**
   ```bash
   node --version  # Should output v18.x.x or higher
   ```
   Download from: https://nodejs.org/

2. **npm 9+**
   ```bash
   npm --version  # Should output 9.x.x or higher
   ```
   (Comes with Node.js)

3. **Git**
   ```bash
   git --version
   ```
   Download from: https://git-scm.com/

### System Requirements

- **OS**: macOS, Windows, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 500MB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd /Users/ugochindubuisi1/github-repos/largo-lab-portal
```

### Step 2: Verify Project Files

Check that these files exist:

```bash
ls -la package.json
ls -la tsconfig.json
ls -la vite.config.ts
ls -la tailwind.config.js
```

If any are missing, the installation is incomplete.

### Step 3: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 1234 packages in 45s
```

**This installs:**
- React 18.2 and React DOM
- TypeScript 5.3
- Vite 5.0 (build tool)
- Tailwind CSS 3.4
- Zustand 4.4 (state management)
- @dnd-kit 6.1 (drag and drop)
- jsPDF 2.5 (PDF export)
- XLSX 0.18 (Excel export)
- date-fns 3.0 (date utilities)
- Jest 29.7 (testing)
- And 1200+ more packages

### Step 4: Verify Installation

```bash
npm run type-check
```

**Expected Output:**
```
No TypeScript errors
```

### Step 5: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 1234 ms

➜  Local:   http://localhost:3000/largo-lab-portal/
➜  Network: use --host to expose
```

### Step 6: Open in Browser

Navigate to: **http://localhost:3000/largo-lab-portal/**

You should see the Largo Laboratory Portal home page.

## Troubleshooting Installation

### Issue: "npm: command not found"

**Solution:**
```bash
# Install Node.js from nodejs.org
# Restart terminal after installation
node --version
npm --version
```

### Issue: "EACCES: permission denied"

**Solution:**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER /usr/local/lib/node_modules
sudo chown -R $USER /usr/local/bin

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear everything and reinstall
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Option 1: Kill process on port 3000
npx kill-port 3000

# Option 2: Use different port
npm run dev -- --port 3001
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check for syntax errors
npm run type-check

# If errors persist, check tsconfig.json exists
ls -la tsconfig.json
```

### Issue: Build fails

**Solution:**
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Verify Installation Checklist

Use this checklist to ensure everything is working:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] All dependencies installed (`npm install` completes)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Development server starts (`npm run dev`)
- [ ] Browser opens to localhost:3000
- [ ] Home page displays correctly
- [ ] Navigation links work
- [ ] Schedule page loads
- [ ] Can drag staff members
- [ ] Export menu appears

## Post-Installation Setup

### Optional: Configure VS Code

Install recommended extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Optional: Set Up Git Hooks

```bash
# Install husky for pre-commit hooks
npx husky-init && npm install

# Add pre-commit lint check
npx husky add .husky/pre-commit "npm run lint"
```

### Optional: Configure Environment Variables

Create `.env.local` file (optional):

```env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=Largo Lab Portal
```

## Development Workflow

### Daily Development

```bash
# 1. Start development server
npm run dev

# 2. Make code changes
# Files auto-reload on save

# 3. Run tests
npm test

# 4. Check types
npm run type-check

# 5. Lint code
npm run lint
```

### Before Committing

```bash
# Format code
npm run format

# Run all checks
npm run lint && npm run type-check && npm test

# Build to verify
npm run build
```

### Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Uninstallation

To completely remove the project:

```bash
# Remove node_modules
rm -rf node_modules

# Remove build output
rm -rf dist

# Remove lock file
rm package-lock.json

# Remove cache
rm -rf node_modules/.vite
```

## Getting Help

### Resources

1. **Quick Start Guide**: See `QUICK_START.md`
2. **Implementation Guide**: See `IMPLEMENTATION_GUIDE.md`
3. **Full README**: See `README-REACT-V3.md`
4. **Production Summary**: See `PRODUCTION_SUMMARY.md`

### Common Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run type-check` | Check TypeScript types |
| `npm run deploy` | Deploy to GitHub Pages |

### Support Contacts

- **Technical Issues**: Contact development team
- **Documentation**: See guides above
- **Bug Reports**: Create GitHub issue

## Success!

If you can see the portal in your browser, installation is complete! 🎉

**Next Steps:**
1. Read `QUICK_START.md` to learn basic usage
2. Create your first schedule
3. Explore the features
4. Review documentation for advanced topics

---

**Installation Guide Version:** 1.0  
**Last Updated:** January 2025  
**For:** Largo Lab Portal v3.0
