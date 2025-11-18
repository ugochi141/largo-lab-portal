# SharePoint Migration Guide
## Kaiser Permanente Largo Laboratory Portal

This guide explains how to migrate the GitHub Pages Largo Lab Portal to SharePoint.

**Target SharePoint Site:** https://sp-cloud.kp.org/sites/LargoLabTeamPortal

---

## Table of Contents
1. [Overview](#overview)
2. [Pre-Migration Checklist](#pre-migration-checklist)
3. [SharePoint Site Structure](#sharepoint-site-structure)
4. [File Migration Steps](#file-migration-steps)
5. [SharePoint-Specific Adaptations](#sharepoint-specific-adaptations)
6. [Navigation Setup](#navigation-setup)
7. [Permissions & Security](#permissions--security)
8. [Testing & Validation](#testing--validation)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What We're Migrating
- **Main Portal Pages:** index.html, manager-dashboard.html, equipment-tracker.html, etc.
- **Daily Schedule System:** Full scheduling with edit capabilities
- **QC/Maintenance Calendars:** Interactive monthly calendars
- **Inventory Management:** Automated ordering system
- **Documentation:** Guides, SOPs, and help files

### Why SharePoint?
- ✅ **Enterprise Integration:** Direct KP authentication (SSO)
- ✅ **Version Control:** SharePoint's built-in versioning
- ✅ **Access Control:** Granular permissions per page/library
- ✅ **Search:** Enterprise search across all content
- ✅ **Backup:** Automatic KP backup systems

---

## Pre-Migration Checklist

### Required Permissions
- [ ] SharePoint Site Owner or Member permissions
- [ ] Ability to create Document Libraries
- [ ] Ability to create Site Pages
- [ ] Access to Site Settings

### Required Information
- [ ] SharePoint Site URL: `https://sp-cloud.kp.org/sites/LargoLabTeamPortal`
- [ ] List of users who need access (by role)
- [ ] Existing Active Directory groups for permissions

### Tools Needed
- [ ] Modern web browser (Chrome, Edge recommended)
- [ ] SharePoint Designer (optional, for advanced customization)
- [ ] Access to GitHub repository for current files

---

## SharePoint Site Structure

### Recommended Document Libraries

```
/LargoLabPortal (Site)
├── /SiteAssets (Library)
│   ├── /css
│   │   └── kps-portal.css
│   ├── /js
│   │   ├── main.js
│   │   ├── navigation.js
│   │   └── schedule-manager.js
│   └── /assets
│       └── /icons
├── /Documents (Library)
│   ├── /SOPs
│   ├── /Schedules
│   └── /Reports
├── /SitePages (Library - Auto-created)
│   ├── Home.aspx
│   ├── DailySchedule.aspx
│   ├── ManagerDashboard.aspx
│   ├── EquipmentTracker.aspx
│   ├── Inventory.aspx
│   └── QCMaintenance.aspx
└── /Lists
    ├── Schedule Data (Custom List)
    ├── Equipment Inventory (Custom List)
    └── Maintenance Tasks (Custom List)
```

---

## File Migration Steps

### Step 1: Create Document Libraries

1. **Go to Site Contents**
   - Navigate to: `https://sp-cloud.kp.org/sites/LargoLabTeamPortal/_layouts/15/viewlsts.aspx`
   - Click **+ New** → **Document Library**

2. **Create These Libraries:**
   - **SiteAssets** (for CSS, JS, images)
   - **ScheduleFiles** (for schedule HTML files)
   - **Documentation** (for guides and SOPs)

### Step 2: Upload Static Assets

1. **Upload CSS Files:**
   ```
   Upload to: /SiteAssets/css/
   - kps-portal.css
   ```

2. **Upload JavaScript Files:**
   ```
   Upload to: /SiteAssets/js/
   - main.js
   - navigation.js
   - schedule-manager.js
   ```

3. **Upload Icons/Images:**
   ```
   Upload to: /SiteAssets/assets/icons/
   - All .svg, .png files
   ```

### Step 3: Create SharePoint Pages

SharePoint uses `.aspx` pages instead of `.html`. Here's how to convert:

#### Option A: Modern Pages (Recommended)

1. **Go to Site Pages**
2. **Click + New → Site Page**
3. **For each page:**
   - Home Page → Use "Web Part Page" layout
   - Daily Schedule → Use "Full Width" layout
   - Manager Dashboard → Use "Three Column" layout

#### Option B: Wiki Pages (For HTML Embedding)

1. **Go to Site Pages**
2. **Click + New → Wiki Page**
3. **Name it:** `DailySchedule` (becomes DailySchedule.aspx)
4. **Edit page → Insert → Embed Code**
5. **Paste your HTML content**

### Step 4: Adapt File Paths

**Change all asset references from relative to absolute SharePoint paths:**

```html
<!-- BEFORE (GitHub Pages) -->
<link rel="stylesheet" href="../assets/css/kps-portal.css">
<script src="../js/main.js"></script>

<!-- AFTER (SharePoint) -->
<link rel="stylesheet" href="/sites/LargoLabTeamPortal/SiteAssets/css/kps-portal.css">
<script src="/sites/LargoLabTeamPortal/SiteAssets/js/main.js"></script>
```

---

## SharePoint-Specific Adaptations

### 1. Navigation Menu

**Create SharePoint Navigation:**

1. **Go to Site Settings → Navigation**
2. **Add to Current Navigation:**
   - Home
   - Daily Schedule
   - Manager Dashboard
   - Equipment Tracker
   - Inventory Management
   - QC/Maintenance
   - Help & Documentation

### 2. Replace localStorage with SharePoint Lists

**Current GitHub implementation uses localStorage. SharePoint should use Lists:**

```javascript
// BEFORE (localStorage)
localStorage.setItem('dailyScheduleData', JSON.stringify(scheduleData));

// AFTER (SharePoint REST API)
$.ajax({
    url: _spPageContextInfo.webAbsoluteUrl +
         "/_api/web/lists/getbytitle('Schedule Data')/items",
    method: "POST",
    data: JSON.stringify({
        __metadata: { type: "SP.Data.ScheduleDataListItem" },
        Title: dateString,
        ScheduleJSON: JSON.stringify(scheduleData)
    }),
    headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    }
});
```

### 3. Authentication Integration

SharePoint automatically handles authentication via KP SSO. Remove any custom auth:

```javascript
// REMOVE from code
// Any localStorage-based authentication
// Any manual login forms

// SharePoint provides:
_spPageContextInfo.userId        // Current user ID
_spPageContextInfo.userDisplayName  // Current user name
_spPageContextInfo.userLoginName    // KP login
```

### 4. Backend Server Integration

**Option A: Keep Node.js Backend**
- Host on separate Azure VM
- Configure CORS to allow SharePoint domain
- Update API endpoints in SharePoint pages

**Option B: Use SharePoint as Backend**
- Replace Express.js with SharePoint REST API
- Use SharePoint Lists instead of JSON files
- Use SharePoint Workflows for automation

---

## Navigation Setup

### SharePoint Quick Launch (Left Nav)

1. **Go to Site Settings → Navigation**
2. **Configure Current Navigation (Quick Launch):**

```
🏠 Home
📅 Schedules
  ├── Daily Schedule
  ├── QC/Maintenance Calendar
  └── On-Call Schedule
📊 Operations
  ├── Manager Dashboard
  ├── Equipment Tracker
  └── Inventory Management
📚 Resources
  ├── Standard Operating Procedures
  ├── Training Materials
  └── Contacts
⚙️ Settings
  └── Site Administration
```

### Top Navigation Bar

```
Home | Schedules | Operations | Resources | Help
```

---

## Permissions & Security

### 1. Create Permission Groups

**Site Settings → People and Groups → Create Group:**

1. **Largo Lab Managers**
   - Permission Level: Full Control
   - Members: Laboratory managers

2. **Largo Lab Staff - MLS/MLT**
   - Permission Level: Edit
   - Members: All MLS/MLT staff

3. **Largo Lab Staff - Phlebotomy**
   - Permission Level: Contribute
   - Members: All phlebotomy staff

4. **Largo Lab Viewers**
   - Permission Level: Read
   - Members: Leadership, auditors

### 2. Set Page-Level Permissions

**Restrict sensitive pages:**

1. **Manager Dashboard**
   - Break inheritance
   - Grant: Largo Lab Managers (Full Control)
   - Grant: Leadership (Read)

2. **Inventory Management**
   - Break inheritance
   - Grant: Largo Lab Managers (Edit)
   - Grant: Inventory Coordinators (Edit)
   - Grant: All Staff (Read)

### 3. Document Library Permissions

**ScheduleFiles Library:**
- Largo Lab Managers: Full Control
- MLS/MLT Staff: Edit
- Phlebotomy Staff: Read

---

## Testing & Validation

### Pre-Launch Checklist

- [ ] All pages load correctly
- [ ] Navigation links work
- [ ] CSS styling displays properly
- [ ] JavaScript functions work
- [ ] Schedule data persists correctly
- [ ] Forms submit successfully
- [ ] Inventory system connects to backend
- [ ] Permissions tested for each role
- [ ] Mobile responsive design works
- [ ] Print functionality works
- [ ] Search finds content

### User Acceptance Testing

**Test with real users from each role:**

1. **Manager Testing:**
   - Can access all features
   - Dashboard shows correct data
   - Can edit schedules
   - Can manage inventory

2. **MLS/MLT Testing:**
   - Can view schedules
   - Can update QC maintenance
   - Can access SOPs
   - Cannot access manager-only features

3. **Phlebotomy Testing:**
   - Can view daily schedule
   - Can check on-call assignments
   - Can view equipment contacts

---

## Troubleshooting

### Common Issues

#### 1. CSS Not Loading

**Problem:** Styles don't apply
**Solution:**
```html
<!-- Check path is absolute -->
<link rel="stylesheet" href="/sites/LargoLabTeamPortal/SiteAssets/css/kps-portal.css">

<!-- If still not working, check library permissions -->
<!-- SiteAssets library must allow Everyone (Read) -->
```

#### 2. JavaScript Errors

**Problem:** `_spPageContextInfo is not defined`
**Solution:**
```html
<!-- Add SharePoint ScriptLink -->
<SharePoint:ScriptLink runat="server" Name="sp.js" />
<SharePoint:ScriptLink runat="server" Name="sp.runtime.js" />
```

#### 3. CORS Errors with Backend

**Problem:** API calls blocked
**Solution:**
```javascript
// In Node.js backend server/index.js
const cors = require('cors');
app.use(cors({
    origin: 'https://sp-cloud.kp.org',
    credentials: true
}));
```

#### 4. Content Not Updating

**Problem:** Old cached content displays
**Solution:**
```
1. Clear browser cache (Ctrl+F5)
2. SharePoint: Site Settings → Site Collection Features
   → Activate "SharePoint Server Publishing Infrastructure"
3. Enable versioning on all libraries
```

---

## Migration Timeline

### Phase 1: Preparation (Week 1)
- [ ] Request SharePoint site permissions
- [ ] Create document libraries
- [ ] Upload static assets
- [ ] Test file access

### Phase 2: Core Pages (Week 2)
- [ ] Migrate main portal pages
- [ ] Create navigation structure
- [ ] Adapt file paths
- [ ] Basic testing

### Phase 3: Advanced Features (Week 3)
- [ ] Migrate Daily Schedule with editing
- [ ] Convert localStorage to SharePoint Lists
- [ ] Integrate backend API (if keeping)
- [ ] QC/Maintenance calendars

### Phase 4: Testing & Refinement (Week 4)
- [ ] User acceptance testing
- [ ] Permission testing
- [ ] Performance optimization
- [ ] Documentation updates

### Phase 5: Go-Live (Week 5)
- [ ] Final testing
- [ ] User training
- [ ] Launch announcement
- [ ] Monitor for issues

---

## Next Steps

1. **Review this guide** with IT and management
2. **Request SharePoint permissions** from KP IT
3. **Schedule migration time** (suggest off-hours)
4. **Identify key users** for testing
5. **Begin Phase 1** of migration

---

## Support Contacts

**SharePoint Admin:** KP IT ServiceDesk
**Project Lead:** Laboratory Manager
**Technical Support:** Application Support Team

---

**Document Version:** 1.0
**Last Updated:** November 4, 2025
**Maintained By:** Largo Laboratory Team
