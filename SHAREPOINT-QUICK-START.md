# SharePoint Migration - Quick Start Guide
## Get Your Portal Live in 1 Hour

**Target Site:** https://sp-cloud.kp.org/sites/LargoLabTeamPortal

---

## 🚀 Quick Deploy (30 Minutes)

### Step 1: Upload Assets (5 minutes)

1. **Go to your SharePoint site**
2. **Click Site Contents → + New → Document Library**
3. **Name it: `SiteAssets`**
4. **Create folders inside:**
   - `css`
   - `js`
   - `assets/icons`

5. **Upload files:**
   ```
   Upload to SiteAssets/css/:
   - kps-portal.css

   Upload to SiteAssets/js/:
   - main.js
   - navigation.js
   ```

### Step 2: Create Home Page (10 minutes)

1. **Go to Site Pages**
2. **Click + New → Site Page**
3. **Choose layout: "Full Width Column"**
4. **Add Web Part:**
   - Click `+` → **Embed**
   - Select **Code Embed** or **File viewer**

5. **Copy index.html content:**
   - From GitHub: https://github.com/ugochi141/largo-lab-portal/blob/main/index.html
   - Paste into Code Embed web part

6. **Fix file paths in the code:**
   ```html
   <!-- Change this: -->
   <link href="assets/css/kps-portal.css" rel="stylesheet">

   <!-- To this: -->
   <link href="/sites/LargoLabTeamPortal/SiteAssets/css/kps-portal.css" rel="stylesheet">
   ```

7. **Click Publish**

### Step 3: Create Navigation (5 minutes)

1. **Click Settings gear → Site Information → View all site settings**
2. **Under Look and Feel → Navigation**
3. **Add to Current Navigation:**
   - Home
   - Daily Schedule
   - Manager Dashboard
   - Equipment Tracker
   - Inventory
   - QC Maintenance

4. **Save**

### Step 4: Set Permissions (10 minutes)

1. **Settings → Site Permissions**
2. **Click "Stop Inheriting Permissions"**
3. **Grant Access:**
   - Add your laboratory staff groups
   - Set appropriate permission levels:
     - Managers: Full Control
     - Staff: Contribute
     - Viewers: Read

---

## 📋 Essential Files to Upload

### Priority 1 (Must Have)
```
✓ index.html → Home page
✓ assets/css/kps-portal.css → Styling
✓ Schedules/Daily Schedule.html → Main schedule
✓ manager-dashboard.html → Manager tools
```

### Priority 2 (Important)
```
✓ equipment-tracker.html
✓ inventory.html
✓ Schedules/QC_Maintenance_*.html
✓ js/main.js
✓ js/navigation.js
```

### Priority 3 (Nice to Have)
```
✓ All other HTML pages
✓ Documentation files
✓ Additional JavaScript
```

---

## ⚡ SharePoint-Specific Changes

### 1. Update All File Paths

**Find and Replace in all HTML files:**

```
FROM: href="../assets/
TO:   href="/sites/LargoLabTeamPortal/SiteAssets/assets/

FROM: href="assets/
TO:   href="/sites/LargoLabTeamPortal/SiteAssets/assets/

FROM: src="../js/
TO:   src="/sites/LargoLabTeamPortal/SiteAssets/js/

FROM: src="js/
TO:   src="/sites/LargoLabTeamPortal/SiteAssets/js/
```

### 2. Add SharePoint Master Page (Optional)

If you want the SharePoint top nav and branding:

```html
<!-- Add at top of page -->
<%@ Page language="C#"
    MasterPageFile="~masterurl/default.master"
    Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage" %>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <!-- Your HTML content here -->
</asp:Content>
```

### 3. Remove Home Buttons

SharePoint has built-in navigation, so remove the fixed Home buttons:

```html
<!-- Remove this from all pages: -->
<a href="../index.html" class="home-btn">🏠 Home</a>
```

---

## 🔧 Common SharePoint Adaptations

### Replace localStorage with SharePoint

**For schedule data:**

```javascript
// OLD (GitHub Pages)
localStorage.setItem('scheduleData', JSON.stringify(data));

// NEW (SharePoint)
// Create a SharePoint List named "ScheduleData"
// Then use:
async function saveSchedule(date, data) {
    const response = await fetch(
        `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('ScheduleData')/items`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
            },
            body: JSON.stringify({
                __metadata: { type: 'SP.Data.ScheduleDataListItem' },
                Title: date,
                ScheduleJSON: JSON.stringify(data)
            })
        }
    );
    return response.json();
}
```

### Get Current User Info

```javascript
// SharePoint provides:
const userName = _spPageContextInfo.userDisplayName;
const userEmail = _spPageContextInfo.userEmail;
const userId = _spPageContextInfo.userId;

// Use for audit logging
console.log(`User ${userName} modified schedule`);
```

---

## 📱 Mobile Responsive Check

SharePoint has different rendering on mobile. Test:

1. **Open page on phone/tablet**
2. **Check navigation works**
3. **Verify tables are scrollable**
4. **Test forms submit correctly**

If issues, add:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## ✅ Testing Checklist

After migration, verify:

- [ ] Home page loads
- [ ] Navigation links work
- [ ] CSS styles display
- [ ] JavaScript functions execute
- [ ] Daily schedule shows data
- [ ] Forms submit successfully
- [ ] Users can access based on permissions
- [ ] Mobile view works
- [ ] Print functionality works

---

## 🆘 Quick Fixes

### "Page Not Found"
**Fix:** Check your URL doesn't have spaces
- Change: `Daily Schedule.aspx`
- To: `DailySchedule.aspx`

### "Access Denied"
**Fix:** Grant yourself Full Control
1. Go to page
2. Click ⋮ (More) → Manage Access
3. Add yourself with Full Control

### "CSS Not Loading"
**Fix:** Make SiteAssets library accessible
1. Go to SiteAssets library
2. Click ⚙️ → Library Settings
3. Permissions → Grant "Everyone" Read access

### "JavaScript Errors"
**Fix:** Add SP.js reference
```html
<script src="/_layouts/15/sp.runtime.js"></script>
<script src="/_layouts/15/sp.js"></script>
```

---

## 🎯 Next Steps

1. **Complete upload** of all files
2. **Test each major feature**
3. **Train key users**
4. **Get feedback**
5. **Iterate and improve**

---

## 📞 Need Help?

- **SharePoint Support:** Contact KP IT ServiceDesk
- **Technical Issues:** Email your application support team
- **Portal Questions:** Contact Laboratory Manager

---

**Estimated Time: 30-60 minutes**
**Difficulty: Medium**
**Prerequisites: SharePoint Site Member or Owner access**
