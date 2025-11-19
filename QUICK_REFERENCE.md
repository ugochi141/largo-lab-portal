# Largo Lab Portal - Quick Reference Guide

## 🌐 Domain & URLs

### Production (www.largolabportal25.com)
```
Main:        https://www.largolabportal25.com
Login:       https://www.largolabportal25.com/login
Staff:       https://www.largolabportal25.com/staff
Admin:       https://www.largolabportal25.com/admin
API:         https://www.largolabportal25.com/api
```

### Development (localhost)
```
Main:        http://localhost:3000/largo-lab-portal
Login:       http://localhost:3000/largo-lab-portal/login
API:         http://localhost:3000/api
```

---

## 🔐 Login Credentials

### Admin
- **Username**: `T773835`
- **Password**: `LargoLab25` (must reset on first login)
- **Access**: Full portal (read/write/delete)

### Staff
- **Username**: Your NUID (from Staff_Roster.html)
- **Password**: `LargoLab25` (must reset on first login)
- **Access**: Read-only (SOPs, Schedules, Inventory, Support)

---

## 🚀 Quick Start Commands

### Development
```bash
cd /Users/ugochindubuisi1/largo-lab-portal-project
npm run dev              # Start dev server (localhost:3000)
npm run server:dev       # Start backend API (localhost:3001)
```

### Production Build
```bash
npm run build            # Build for production
npm run preview          # Preview production build
```

### Backend Server
```bash
npm run pm2:start        # Start backend with PM2
npm run pm2:logs         # View logs
npm run pm2:restart      # Restart backend
npm run pm2:stop         # Stop backend
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env.production` | Production domain config |
| `.env.development` | Development config |
| `vite.config.ts` | Build & routing config |
| `src/App.tsx` | Main router setup |
| `src/store/authStore.ts` | Authentication logic |
| `DOMAIN_CONFIGURATION.md` | Complete setup guide |

---

## 🎯 Staff Portal Routes (Read-Only)

```
/staff              → Home Dashboard
/staff/sops         → Standard Operating Procedures  
/staff/schedule     → Daily Schedules
/staff/qc           → QC Maintenance Schedules
/staff/inventory    → Inventory View
/staff/support      → Technical Support
```

---

## 👨‍💼 Admin Portal Routes (Full Access)

```
/admin                         → Admin Dashboard
/admin/schedule                → Schedule Viewer
/admin/schedule-manager        → Schedule Editor
/admin/inventory               → Inventory Management
/admin/inventory/chemistry     → Chemistry Supplies
/admin/inventory/hematology    → Hematology Supplies
/admin/inventory/urinalysis    → Urinalysis Supplies
/admin/staff                   → Staff Management
/admin/safety                  → Safety & Compliance
/admin/resources/sops          → SOP Management
```

---

## 🔧 Troubleshooting

### Can't login?
- Check username (T773835 for admin, NUID for staff)
- Verify default password: `LargoLab25`
- Ensure backend API is running

### API errors?
```bash
# Check backend status
npm run pm2:status

# View backend logs
npm run pm2:logs

# Restart backend
npm run pm2:restart
```

### Wrong URL in production?
- Ensure `NODE_ENV=production` when building
- Check `.env.production` has correct domain
- Clear browser cache

---

## 📞 Support

For issues or questions:
1. Check `DOMAIN_CONFIGURATION.md` for detailed setup
2. Check `TROUBLESHOOTING.md` for common issues
3. Contact IT department or system administrator

---

## ✅ Deployment Checklist

- [ ] Update DNS to point to server
- [ ] Build production version (`npm run build`)
- [ ] Upload to web server
- [ ] Configure Nginx/Apache
- [ ] Install SSL certificate
- [ ] Start backend API
- [ ] Test admin login
- [ ] Test staff login
- [ ] Verify read-only for staff
- [ ] Test all portal features

---

**Last Updated**: November 19, 2025  
**Version**: 3.0.0  
**Status**: ✅ Production Ready
