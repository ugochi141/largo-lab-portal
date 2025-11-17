# Largo Lab Portal - Broken & Non-Functional Features Analysis

**Analysis Date:** November 17, 2025  
**Deployment Mode:** Static HTML (GitHub Pages)  
**Backend Status:** Express.js server available but not deployed with GitHub Pages

---

## EXECUTIVE SUMMARY

The Largo Lab Portal is a **dual-mode application** with critical incompatibilities when deployed to GitHub Pages (static HTML mode). While the static HTML pages render correctly, approximately **8-10 major features** are non-functional in the static deployment because they depend on a Node.js backend server that is not available on GitHub Pages.

**Critical Issue:** The application assumes a backend server is always running. Without it, inventory management, automated order sending, and other server-dependent features fail gracefully but completely.

---

## 1. BROKEN BACKEND API DEPENDENCIES

### **Category: Critical - Features Won't Work**

#### 1.1 Inventory Management System
- **File:** `inventory.html`
- **API Endpoint:** `/api/inventory`
- **Status:** Non-functional on GitHub Pages
- **What Fails:**
  - Loading inventory data: `const response = await fetch(API_BASE);` (line 461)
  - Sending orders: `const response = await fetch(${API_BASE}/orders/send, ...)` (line 716)
  - Dynamic filtering and real-time updates
- **Error Handling:** Shows user-friendly error message with instructions to start backend server
  - Message directs to run: `npm run pm2:start` or `npm run dev`
  - Provides clear instructions on how to fix the issue
  - Shows error at lines 488-515 of inventory.html
- **Backend Implementation:** Exists in `server/routes/inventory.js` but requires Node.js runtime
- **Severity:** HIGH - Core feature, but has good error handling

#### 1.2 Automated Order Sending
- **File:** `inventory.html`
- **Function:** `confirmOrder()` → `fetch(${API_BASE}/orders/send, {...})`
- **Status:** Non-functional on GitHub Pages
- **What Fails:**
  - Cannot send automated inventory order emails
  - Email recipient list hardcoded: LargoInventoryTeam@KP.org, Alex.X.Roberson@kp.org, Tianna.J.Maxwell@kp.org
  - Should trigger SMTP via backend emailService
- **Workaround:** Manual email to recipients
- **Severity:** MEDIUM - Workflow-critical but has manual alternative

---

## 2. PLACEHOLDER & "COMING SOON" FEATURES

### **Category: Incomplete Implementations**

#### 2.1 TAT (Turnaround Time) Monitoring
- **File:** `tat-monitoring.html`
- **Issues:**
  - Line 351: "Trend chart showing daily average TAT. Chart visualization coming soon."
  - Line 394: Comment "In production, this would fetch from backend API"
  - Line 479: Comment "In production, fetch filtered data from API"
- **Current Implementation:** Simulated/hardcoded data with random values
  - Uses `Math.floor(Math.random() * range) + offset` to generate fake metrics (lines 406-408)
  - Does NOT actually pull from localStorage or any real source
- **What Works:** Display of hardcoded demo data
- **What Doesn't Work:** Real-time TAT tracking, actual performance metrics
- **Severity:** HIGH - Users may think they're seeing real data

#### 2.2 PDF Export Feature
- **File:** `debug-portal.html`
- **Status:** Not implemented (line 751)
- **Message:** "PDF export functionality requires jsPDF library. Feature coming soon!"
- **Severity:** LOW - Debug portal feature

#### 2.3 CSV Export Feature  
- **File:** `debug-portal.html`
- **Status:** Not implemented (line 780)
- **Message:** "CSV export functionality coming soon!"
- **Severity:** LOW - Debug portal feature

#### 2.4 Email Functionality
- **File:** `debug-portal.html`
- **Status:** Not implemented (line 785)
- **Message:** "Email functionality requires backend integration. Feature coming soon!"
- **Severity:** MEDIUM - Affects communication workflows

#### 2.5 TAT Trend Chart Visualization
- **File:** `tat-monitoring.html`
- **Status:** Placeholder div with coming soon message (lines 347-369)
- **What's Missing:** Chart.js or similar visualization library integration
- **Severity:** MEDIUM - Important for performance analysis

---

## 3. EXTERNAL SYSTEM DEPENDENCIES (Won't Work in Static Mode)

### **Category: Third-Party Integration Failures**

#### 3.1 Kaiser SSO Authentication Links
- **Files:** Multiple (manager-dashboard.html, etc.)
- **Systems Referenced:**
  - HR Connect: `https://hrconnect.kp.org`
  - Service Now: `https://servicenow.kp.org`
  - TempTrak: `https://temptrakmas.appl.kp.org`
  - KP Learn: `https://kplearn.kp.org`
  - PolicyTech: `https://policytech.kp.org`
  - Printer Portal: `https://maprinters.kp.org`
  - Smart Square: `https://kaisermidatlantic.smart-square.com/v2/login`

- **Status:** Links work, but require Kaiser VPN + SSO credentials
- **Limitations:**
  - Not available outside Kaiser network
  - No embedded functionality, just external links
  - SSO integration not implemented in app
- **Severity:** LOW for GitHub Pages, MEDIUM for on-premises deployment

#### 3.2 SharePoint Integration
- **Files:** `sharepoint-team-portal.html`, SOPs/downtime-procedures.html
- **References:**
  - `sp-cloud.kp.org/sites/MASEHS`
  - `sp-cloud.kp.org/sites/MASLabAllStaff`
  - `sp-cloud.kp.org/sites/KPMASLabOpsTeam`
- **Status:** Not implemented, just documentation
- **Severity:** LOW - Reference/informational links

#### 3.3 Epic Beaker Integration
- **Referenced In:** `server/routes/health.js` line 106
- **Status:** Referenced but not implemented
- **Backend Check:** Looks for `EPIC_API_URL` environment variable
- **Code:** `epicBeaker: process.env.EPIC_API_URL ? 'configured' : 'not configured'`
- **Severity:** LOW - Health check only, no actual functionality

#### 3.4 SMTP Email Service
- **File:** `server/services/emailService.js`
- **Configuration:** `host: process.env.SMTP_HOST || 'smtp.kp.org'`
- **Status:** Not functional on GitHub Pages (requires Node.js server)
- **Severity:** MEDIUM - Blocks order notifications

---

## 4. DATA PERSISTENCE & localStorage ISSUES

### **Category: Functional But With Caveats**

#### 4.1 Schedule Data Loading
- **File:** `Schedules/Daily Schedule.html` (52,000+ lines)
- **Implementation:** Good - Prioritizes localStorage over hardcoded data
- **Status:** WORKING
- **Flow:**
  1. Checks localStorage key `'dailyScheduleData'`
  2. Falls back to hardcoded `scheduleData` JavaScript object
  3. Falls back to sample/default data
- **Caveat:** Users must manually clear localStorage if issues arise
  - Method: `localStorage.clear(); location.reload();`

#### 4.2 Technical Support Form
- **File:** `technical-support.html`
- **Status:** Partially broken
- **What Works:** Form submission and validation
- **What Doesn't Work:** Sending email
- **Code:** Line 433 "Save to localStorage (in production, this would send to backend)"
- **Severity:** MEDIUM - Form appears functional but doesn't actually send requests

#### 4.3 General localStorage Usage  
- **Instances:** 196+ references throughout codebase
- **Status:** Working for read/write operations
- **Limitation:** No data synchronization with server
- **Severity:** LOW - By design for static deployment

---

## 5. INCOMPLETE FORM IMPLEMENTATIONS

### **Category: Forms Without Backend Handlers**

#### 5.1 Support Request Form
- **File:** `technical-support.html`
- **Form Fields:** Requester name, email, phone, issue type, priority, description
- **Submit Handler:** Missing backend integration
- **Current Implementation:** Saves to localStorage only (line 433)
- **Expected Behavior:** Should send to backend support queue
- **Severity:** HIGH - User assumes request is being processed

#### 5.2 Support Request Quick Links
- **File:** `technical-support.html` lines 310-312
- **Functions:**
  - `fillQuickIssue('network')` - Network Issue button
  - `fillQuickIssue('printer')` - Printer Down button
  - `fillQuickIssue('login')` - Can't Login button
- **Status:** Functions exist and work, but form submission still fails
- **Severity:** MEDIUM - Partial functionality

---

## 6. MISSING FILE REFERENCES

### **Category: Broken Links & Missing Assets**

#### 6.1 CSS File Status
- **Files Checked:** ✓ All CSS files present
  - `css/kp-styles.css` - EXISTS
  - `css/main.css` - EXISTS
  - `css/responsive.css` - EXISTS
  - `assets/css/kaiser-portal.css` - EXISTS
- **Status:** NO MISSING CSS FILES

#### 6.2 JavaScript File Status
- **Files Checked:** ✓ All core JS files present
  - `js/main.js` - EXISTS
  - `js/dashboard.js` - EXISTS
  - `js/navigation.js` - EXISTS
  - `js/inventory.js` - EXISTS
- **Status:** NO MISSING JS FILES

#### 6.3 Image/Icon Files
- **Status:** Some references but mostly SVG data URLs
- **Missing:** No known missing images in critical paths
- **Verified File:** `assets/kp-logo.svg` - EXISTS

#### 6.4 Schedule Files (Case Sensitivity)
- **Issue:** GitHub Pages is case-sensitive
- **Files:**
  - `Schedules/Daily Schedule.html` - EXISTS (with space)
  - `schedules/daily-schedule.html` - Also exists (lowercase)
- **Risk:** Potential conflicts if both referenced in different places
- **Severity:** LOW - Both files exist

---

## 7. SECURITY ISSUES & EXPOSED CREDENTIALS

### **Category: Critical Security Findings**

#### 7.1 Default JWT Secret
- **File:** `server/routes/auth.js` line 70
- **Code:** `process.env.JWT_SECRET || 'default-secret-change-in-production'`
- **Issue:** Has hardcoded fallback secret
- **Severity:** CRITICAL
- **Recommendation:** Must use environment variable in production

#### 7.2 Default SMTP Configuration
- **File:** `server/services/emailService.js` line 14
- **Code:** `host: process.env.SMTP_HOST || 'smtp.kp.org'`
- **Issue:** Fallback to hardcoded internal KP SMTP server
- **Severity:** HIGH - May attempt to send to real Kaiser systems
- **Risk:** Could accidentally trigger real emails if backend runs

#### 7.3 Missing Environment Variable Handling
- **Files:** Multiple server routes
- **Issue:** Code uses `process.env.VAR || 'fallback'` pattern
- **Risk:** Fallbacks may not be appropriate for production
- **Variables Missing Proper Validation:**
  - `SENTRY_DSN` - Error tracking
  - `EPIC_API_URL` - EHR integration
  - `SMTP_HOST` - Email server
  - `JWT_SECRET` - Auth tokens

#### 7.4 No Input Validation on Forms
- **Files:** `inventory.html`, `technical-support.html`, `tat-monitoring.html`
- **Status:** Forms use HTML5 validation only
- **Issue:** No server-side validation (backend not deployed)
- **Severity:** MEDIUM - Frontend validation only bypassed easily

#### 7.5 Exposed Email Addresses  
- **File:** `inventory.html` line 698-699
- **Emails Hardcoded:**
  - LargoInventoryTeam@KP.org
  - Alex.X.Roberson@kp.org
  - Tianna.J.Maxwell@kp.org
- **Risk:** Email harvesting via page source
- **Severity:** LOW - Already internal Kaiser addresses

---

## 8. UNDEFINED FUNCTIONS & BROKEN REFERENCES

### **Category: Code Issues**

#### 8.1 Function Call Verification
- **Status:** Most functions properly defined in same file
- **Note:** Dependent functions properly contained within HTML `<script>` blocks
- **No Critical Findings:** All referenced functions exist in their scope

#### 8.2 Global Scope Issues
- **Observation:** Extensive use of global functions in `<script>` tags
- **Risk:** Namespace pollution
- **Severity:** LOW - Works in current setup but poor practice

---

## 9. FEATURE MATRIX: What Works vs. What Doesn't

### **GitHub Pages (Static HTML) Deployment:**

| Feature | Status | Notes |
|---------|--------|-------|
| **Scheduling Display** | ✓ WORKS | Hardcoded + localStorage |
| **Schedule Upload (localStorage)** | ✓ WORKS | Client-side only |
| **Schedule Download** | ✓ WORKS | localStorage export |
| **QC/Maintenance Calendar** | ✓ WORKS | Hardcoded data |
| **Manager Dashboard Display** | ✓ WORKS | Static content |
| **Staff Directory** | ✓ WORKS | Static data |
| **Inventory Viewing** | ✗ BROKEN | Requires `/api/inventory` |
| **Inventory Orders** | ✗ BROKEN | Requires `/api/inventory/orders/send` |
| **TAT Monitoring (Real)** | ✗ BROKEN | Requires backend API |
| **Support Ticket Submission** | ✗ BROKEN | No email integration |
| **Equipment Tracking** | ✓ WORKS | Static/localStorage |
| **Timecard Management** | ✓ WORKS | Display only |
| **PDF Export** | ✗ NOT IMPLEMENTED | Placeholder |
| **CSV Export** | ✗ NOT IMPLEMENTED | Placeholder |
| **Email Notifications** | ✗ BROKEN | No SMTP |
| **Chart Visualizations** | ✗ PARTIAL | Some charts missing |

---

## 10. RECOMMENDATIONS FOR FIXES

### **High Priority:**

1. **Implement localStorage Fallback for Inventory:**
   - Remove API calls or provide clear offline mode
   - Pre-seed with sample inventory data
   - Show warning when features are unavailable

2. **Remove Placeholder Features:**
   - Add status badges to unavailable features
   - Hide "Coming Soon" features or clearly mark them
   - Separate demo/test features from production features

3. **Fix Security Issues:**
   - Remove default JWT_SECRET fallback
   - Don't hardcode email addresses
   - Validate all environment variables

4. **TAT Monitoring:**
   - Either implement simulated data clearly, OR
   - Add banner stating "Demo Data - Not Live"
   - Show which features require backend server

### **Medium Priority:**

1. **Form Implementations:**
   - Make support ticket form async to check if backend available
   - Disable with message if backend not available
   - Provide offline submission option (save locally)

2. **External System Links:**
   - Test all Kaiser system URLs
   - Add network availability checks
   - Graceful handling of redirect failures

3. **Case-Sensitive File References:**
   - Standardize file naming conventions
   - Update all references to be consistent
   - Test on actual GitHub Pages

### **Low Priority:**

1. **UI/UX Improvements:**
   - Add feature availability status in navigation
   - Implement progressive disclosure for unavailable features
   - Add documentation for deployment modes

2. **Logging & Monitoring:**
   - Implement Sentry integration documentation
   - Add browser console error tracking
   - Log feature usage/failures

---

## 11. DEPLOYMENT MODE SUMMARY

### **Static HTML Mode (GitHub Pages) - Current:**
- ✓ Schedule management (with localStorage)
- ✓ QC/Maintenance calendars
- ✓ Manager dashboard
- ✓ Staff directory
- ✗ Inventory management
- ✗ Automated ordering
- ✗ Email notifications
- ✗ Real-time data from backend

### **Node.js Backend Mode (With Server):**
- ✓ Everything above, PLUS:
- ✓ Inventory API
- ✓ Order automation
- ✓ Email notifications
- ✓ User authentication
- ✓ HIPAA-compliant audit logging
- ✓ Real-time data synchronization
- ✓ Critical value alerts

---

## CONCLUSION

The Largo Lab Portal is a **well-architected dual-mode application** but has clear incompatibilities when deployed to GitHub Pages without the backend server. 

**Key Findings:**
- **8-10 major features** require the Node.js backend
- **Good error handling** for missing backend (shows helpful message)
- **No critical security breaches**, but should remove default secrets
- **Well-organized codebase** with clear separation of concerns
- **localStorage implementation** provides good fallback capability

**Recommendation:** 
Deploy with clear documentation about which features require the backend server. Add visual indicators for unavailable features in the GitHub Pages version, or provide a dual-deployment strategy with feature flags.

