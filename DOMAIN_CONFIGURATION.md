# Domain Configuration Guide

## Staff Portal Domain Configuration

### Production Domain
- **Staff Portal URL**: `https://www.largolabportal25.com`
- **Admin Portal URL**: `https://www.largolabportal25.com/admin`
- **API Backend URL**: `https://www.largolabportal25.com/api`

### Development Environment
- **Local URL**: `http://localhost:3000/largo-lab-portal`
- **API URL**: `http://localhost:3000/api`

---

## Environment Variables

### `.env.production` (Production)
```env
VITE_API_URL=https://www.largolabportal25.com/api
VITE_APP_URL=https://www.largolabportal25.com
```

### `.env.development` (Development)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_URL=http://localhost:3000
```

### `.env` (Default)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_URL=http://localhost:3000
VITE_APP_NAME=Largo Laboratory Portal
VITE_ORG_NAME=Kaiser Permanente
```

---

## Authentication Configuration

### Admin Access
- **Username**: `T773835`
- **Default Password**: `LargoLab25`
- **Access Level**: Full portal access (all pages, edit capabilities)
- **First Login**: Password reset required

### Staff Access
- **Username**: NUID (from Staff_Roster.html)
- **Default Password**: `LargoLab25`
- **Access Level**: Read-only access to:
  - SOPs
  - Schedules (Daily & QC Maintenance)
  - Inventory
  - Technical Support
- **First Login**: Password reset required

---

## Portal Routes

### Staff Portal Routes (Read-Only)
```
/login                    - Login page
/staff                    - Staff home dashboard
/staff/sops              - Standard Operating Procedures
/staff/schedule          - Daily schedules view
/staff/qc                - QC Maintenance schedules
/staff/inventory         - Inventory viewing
/staff/support           - Technical support resources
```

### Admin Portal Routes (Full Access)
```
/admin                   - Admin home dashboard
/admin/home              - Main dashboard
/admin/schedule          - Schedule management
/admin/schedule-manager  - Interactive schedule editor
/admin/inventory         - Inventory management
/admin/staff             - Staff management
/admin/safety            - Safety & compliance
/admin/resources         - Resource management
```

---

## Deployment Instructions

### Building for Production

1. **Set environment to production**:
   ```bash
   export NODE_ENV=production
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Preview production build locally**:
   ```bash
   npm run preview
   ```

### Domain Configuration Steps

1. **DNS Configuration**:
   - Point `www.largolabportal25.com` to your server IP
   - Configure A record or CNAME as needed

2. **Web Server Configuration** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name www.largolabportal25.com;
       
       location / {
           root /var/www/largo-lab-portal/dist;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **SSL Certificate** (Recommended):
   ```bash
   certbot --nginx -d www.largolabportal25.com
   ```

---

## Backend API Configuration

### Server Setup
The backend API should be configured to:
1. Listen on appropriate port (default: 3001)
2. Accept requests from `www.largolabportal25.com`
3. Serve authentication endpoints
4. Handle CORS for production domain

### Authentication Endpoints
```
POST /api/auth/login          - User login
POST /api/auth/logout         - User logout
POST /api/auth/change-password - Password change
GET  /api/auth/verify         - Token verification
```

### Data Endpoints
```
GET  /api/inventory           - Get inventory data
GET  /api/schedules           - Get schedules
GET  /api/staff               - Get staff roster
GET  /api/sops                - Get SOPs
POST /api/support/ticket      - Submit support ticket
```

---

## Security Considerations

### Password Requirements
- Default password: `LargoLab25`
- Must be changed on first login
- New password requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character

### Access Control
- Staff users: Read-only access (no edit/delete permissions)
- Admin user (T773835): Full access (create/read/update/delete)
- Session timeout: 8 hours of inactivity
- Token-based authentication with JWT

### Data Protection
- HTTPS required in production
- HIPAA compliant data handling
- Secure session management
- Password hashing with bcrypt

---

## Troubleshooting

### Issue: Cannot access admin portal
**Solution**: Ensure you're logged in with admin credentials (T773835)

### Issue: API calls failing
**Solution**: 
1. Check VITE_API_URL in environment
2. Verify backend server is running
3. Check CORS configuration

### Issue: Staff can modify data
**Solution**: 
1. Verify role-based access control in backend
2. Check authentication token and user role
3. Ensure UI components respect `user.role === 'STAFF'`

---

## Testing

### Local Testing
```bash
# Development mode
npm run dev

# Production build testing
npm run build
npm run preview
```

### Authentication Testing
1. Test admin login: `T773835` / `LargoLab25`
2. Test staff login: Use NUID from staff roster
3. Test password reset flow
4. Verify read-only restrictions for staff
5. Verify full access for admin

---

## Maintenance

### Updating Staff Roster
Staff usernames (NUIDs) are loaded from:
```
/Volumes/.../largo-lab-portal/Schedules/Staff_Roster.html
```

To add/remove staff access:
1. Update Staff_Roster.html
2. Sync with backend database
3. Staff will be able to login with their NUID

### Monitoring
- Check backend logs: `pm2 logs largo-lab-portal`
- Monitor authentication attempts
- Track failed login attempts for security

---

## Contact & Support
For technical issues or access problems, contact the IT department or use the Technical Support portal feature.
