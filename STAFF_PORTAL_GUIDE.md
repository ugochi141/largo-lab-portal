# Staff Portal - User Guide

**Portal Version:** 4.2.0  
**Last Updated:** November 19, 2025  
**Access Level:** Read-Only for Laboratory Staff

---

## 📋 Overview

The **Largo Laboratory Staff Portal** provides read-only access to essential laboratory information for all staff members. You can view schedules, SOPs, inventory, and QC information without the ability to modify data.

---

## 🚀 Quick Start

### Accessing the Portal:

1. **Visit:** https://ugochi141.github.io/largo-lab-portal
2. **Choose:** "Staff Portal" (blue card)
3. **Browse:** 6 available pages with laboratory information

### Navigation:

The Staff Portal has a simple 6-tab navigation:

```
🏠 Home  |  📋 SOPs  |  📅 Schedule  |  🔬 QC Maintenance  |  📦 Inventory  |  🛠️ Support
```

---

## 📄 Available Pages

### 1. Home (`/staff`)

**Purpose:** Dashboard with quick access to all resources

**Features:**
- Quick statistics (SOPs, Staff, Inventory, Alerts)
- Quick access cards to all pages
- Low stock alerts
- Help contact information

**What You'll See:**
- Total SOPs available: 8
- Staff scheduled today: 5
- Inventory items: 44
- Low stock alerts: Real-time count

---

### 2. SOPs (`/staff/sops`)

**Purpose:** View standard operating procedures

**Features:**
- 8 laboratory SOPs
- Search by title or category
- Version numbers and last updated dates
- Categories: Phlebotomy, Chemistry, Hematology, Urinalysis, Blood Bank, Processing, Safety, Maintenance

**Available SOPs:**
1. Phlebotomy Procedures (v3.2)
2. Chemistry Analyzer Operation (v2.1)
3. Hematology QC Procedures (v4.0)
4. Urinalysis Testing (v2.5)
5. Blood Bank Procedures (v5.1)
6. Specimen Processing (v3.0)
7. Safety & Infection Control (v6.2)
8. Equipment Maintenance (v2.8)

**Limitations:**
- ❌ Cannot download PDFs
- ❌ Cannot modify SOPs
- ✅ Can search and view details

---

### 3. Daily Schedule (`/staff/schedule`)

**Purpose:** View today's staff assignments

**Features:**
- Staff member names
- Shift times (Day, Evening, Night)
- Station assignments
- Department breakdowns
- Visual cards and table view

**Information Shown:**
- Staff scheduled: 3-5 people (varies daily)
- Day shift count
- Evening shift count
- Department assignments

**Example:**
```
Netta Johnson     | Day (7AM-3PM)     | Phlebotomy Station 1 | Phlebotomy
Tracy Williams    | Day (7AM-3PM)     | Chemistry Bench      | Chemistry
Booker Smith      | Evening (3PM-11PM) | Hematology          | Hematology
```

**Limitations:**
- ❌ Cannot modify schedule
- ❌ Cannot swap shifts
- ✅ Can view all assignments

---

### 4. QC Maintenance (`/staff/qc`)

**Purpose:** View quality control and maintenance schedule

**Features:**
- Equipment QC tasks
- Daily/Weekly/Monthly frequencies
- Last completed dates
- Next due dates
- Assigned staff members
- Status indicators (Completed, Due Soon, Overdue)

**Equipment Tracked:**
1. Roche Cobas c303 - Daily QC (Level 1 & 2)
2. Sysmex XN-2000 - Hematology QC
3. Stago Star Max - Coagulation QC
4. Weekly maintenance schedules
5. Monthly calibrations

**Status Colors:**
- 🟢 **Green** = Completed on time
- 🟡 **Yellow** = Due within 24 hours
- 🔴 **Red** = Overdue

**Compliance Rate:** 100% (displayed on dashboard)

**Limitations:**
- ❌ Cannot log QC results
- ❌ Cannot mark tasks complete
- ✅ Can see what needs to be done

---

### 5. Inventory (`/staff/inventory`)

**Purpose:** View laboratory supply levels

**Features:**
- **44 real laboratory supplies**
- Search by name or catalog number
- Filter by category (All, Chemistry, Hematology, Urinalysis, Coagulation, Kits)
- Current stock levels vs PAR levels
- Stock status indicators
- Vendor information
- Storage locations

**Categories:**
- Chemistry (reagents, controls)
- Hematology (Sysmex supplies)
- Urinalysis (test strips, reagents)
- Coagulation (Stago supplies)
- Kits (POCT devices, rapid tests)

**Stock Status:**
- 🟢 **In Stock** = Adequate supply
- 🟡 **Low Stock** = Below reorder point
- 🔴 **Out of Stock** = Needs immediate attention

**Example Items:**
```
ALT Reagent Pack        | Cat# 07414463190 | Chemistry   | 25/8  | In Stock
Sysmex Reagent Pack    | Cat# SX-1234567  | Hematology  | 3/10  | Low Stock
UA Test Strips         | Cat# UA-9876543  | Urinalysis  | 0/20  | Out of Stock
```

**What Each Column Means:**
- **Item:** Supply name and vendor
- **Catalog #:** Vendor part number
- **Category:** Supply type
- **Stock:** Current/PAR level
- **Location:** Storage location
- **Status:** Stock level indicator

**Limitations:**
- ❌ Cannot place orders
- ❌ Cannot modify stock levels
- ✅ Can see what's low/out

**When to Alert Admin:**
- Red (Out of Stock) items
- Yellow (Low Stock) items
- Items you use frequently that are running low

---

### 6. Technical Support (`/staff/support`)

**Purpose:** Access resources and get help

**Features:**

**Quick Contacts:**
- 📞 **Emergency:** (301) 555-9111
- 💻 **IT Helpdesk:** (301) 555-4357 (24/7)
- 🔧 **Facilities:** (301) 555-3278 (24/7)
- ⚠️ **Safety:** (301) 555-7233 (Mon-Fri 8AM-5PM)

**Resources Library:**
1. **Equipment Manuals**
   - Roche Cobas c303 User Manual
   - Sysmex XN-2000 Quick Guide
   - Stago Star Max Operation Manual

2. **IT Support**
   - Lab Information System (LIS) login issues
   - Printer troubleshooting
   - Email & password reset

3. **Safety Resources**
   - Chemical spill response
   - Bloodborne pathogen procedures
   - Fire safety & evacuation

4. **Training Materials**
   - New employee orientation
   - Competency assessment forms
   - Continuing education resources

**Common Issues & Solutions:**

**🖨️ Printer Not Working:**
1. Check if printer is on and has paper
2. Verify printer is selected in print dialog
3. Contact IT if issue persists: (301) 555-4357

**💻 Cannot Access LIS:**
1. Verify your network connection
2. Try clearing browser cache
3. Contact IT Helpdesk: (301) 555-4357

**🔧 Equipment Malfunction:**
1. Note error message/code
2. Check equipment log book
3. Contact Lab Director: (301) 555-0101

**📦 Supply Running Low:**
1. Check inventory system for reorder status
2. Note item in supply log
3. Notify Lab Manager immediately

**Limitations:**
- ❌ Cannot download manuals
- ❌ Cannot submit tickets
- ✅ Can view all resources

---

## 🔒 Read-Only Access Explained

### What "Read-Only" Means:

**You CAN:**
- ✅ View all information
- ✅ Search and filter data
- ✅ Check stock levels
- ✅ See schedules
- ✅ Read SOPs
- ✅ Access support resources

**You CANNOT:**
- ❌ Modify inventory
- ❌ Place orders
- ❌ Edit schedules
- ❌ Add/remove staff
- ❌ Change any data
- ❌ Download files
- ❌ Generate reports
- ❌ Delete anything

### Why Read-Only?

1. **Data Integrity:** Prevents accidental changes
2. **Compliance:** Maintains audit trail
3. **Security:** Protects sensitive information
4. **Workflow:** Clear separation of duties

### Visual Indicators:

**You'll see these throughout the portal:**
- 🔒 Yellow banner: "Read-Only Access"
- 👁️ "View Only" badge in header
- Disabled buttons (gray, cannot click)
- Warning messages explaining permissions

---

## 📱 Mobile Access

The Staff Portal is fully responsive and works on:
- 📱 Smartphones (iOS/Android)
- 📱 Tablets (iPad, Android tablets)
- 💻 Desktop computers
- 💻 Laptop computers

**Best Experience:**
- Chrome, Firefox, Safari, Edge (latest versions)
- Portrait or landscape orientation
- Minimum screen width: 320px

---

## 🆘 Getting Help

### Need Full Access?

Contact your **Lab Administrator** if you need:
- Edit permissions
- Order placement access
- Schedule modification
- Report generation
- File downloads

**Administrator Contact:**
- 📧 Email: admin@largo-lab.kp.org
- 📞 Phone: (301) 555-0101
- ⏰ Available: Mon-Fri 8AM-5PM

### Technical Issues?

**Portal Not Loading:**
1. Refresh the page (F5 or Ctrl+R)
2. Clear browser cache
3. Try different browser
4. Contact IT: (301) 555-4357

**Data Not Showing:**
1. Check internet connection
2. Verify you're on staff portal (blue header)
3. Try logging out and back in
4. Contact admin if persists

**Page Looks Wrong:**
1. Check browser version (update if old)
2. Zoom to 100% (Ctrl+0)
3. Try different device
4. Contact IT support

---

## 🎯 Common Tasks

### Task 1: Check Today's Schedule

```
1. Go to Staff Portal home
2. Click "📅 Daily Schedule"
3. View table with all assignments
4. Note your shift time and station
```

### Task 2: Find a SOP

```
1. Click "📋 SOPs" tab
2. Type SOP name in search box
3. View SOP details
4. Note version and last updated date
```

### Task 3: Check Inventory Level

```
1. Click "📦 Inventory" tab
2. Use search or category filter
3. Find your item
4. Check stock level (current/PAR)
5. If low/out, notify admin
```

### Task 4: View QC Schedule

```
1. Click "🔬 QC Maintenance" tab
2. Find your equipment
3. Check next due date
4. Note assigned person
5. Verify task is current
```

### Task 5: Get Technical Help

```
1. Click "🛠️ Tech Support" tab
2. Check common issues first
3. Use quick contact numbers
4. Browse resource library
5. Contact appropriate person
```

---

## 💡 Tips & Best Practices

### Daily Routine:

**Start of Shift:**
1. Check Daily Schedule for assignments
2. Review QC Maintenance for today's tasks
3. Check Inventory for low stock items
4. Note any alerts on home page

**During Shift:**
- Reference SOPs as needed
- Check inventory before using last item
- Monitor QC due dates
- Use tech support for issues

**End of Shift:**
- Note any low stock items observed
- Check schedule for next day
- Report issues to supervisor

### Important Notes:

⚠️ **Stock Alerts:**
- If item shows "Out of Stock" (red), notify admin immediately
- If item shows "Low Stock" (yellow), mention to supervisor
- Don't wait until item is completely out

⚠️ **QC Due Dates:**
- Check "Due Soon" (yellow) items
- Alert assigned person if approaching due date
- Never skip QC because "someone else will do it"

⚠️ **Schedule Changes:**
- Cannot modify schedule in portal
- Contact supervisor for shift swaps
- Emergency changes go through admin

---

## 🔐 Security & Privacy

### Your Responsibility:

✅ **Do:**
- Log out when leaving computer
- Keep login credentials private
- Report suspicious activity
- Only view your assigned information

❌ **Don't:**
- Share your account
- Leave portal open on shared computer
- Take screenshots of sensitive data
- Access admin portal without permission

### Data Privacy:

- All inventory data is for internal use only
- Staff schedules are confidential
- SOPs are proprietary to Kaiser Permanente
- Do not share portal information outside organization

---

## 🆕 What's New

**Version 4.2.0 (November 2025):**
- ✨ NEW: Dedicated Staff Portal with read-only access
- ✨ NEW: Landing page to choose portal type
- ✨ NEW: Real-time inventory data (44 items)
- ✨ NEW: Enhanced QC maintenance tracking
- ✨ NEW: Improved mobile responsiveness
- ✨ NEW: Better search and filtering

---

## 📞 Quick Reference

### Emergency Contacts:

| Department | Number | Available |
|------------|--------|-----------|
| Emergency | (301) 555-9111 | 24/7 |
| Lab Director | (301) 555-0101 | Mon-Fri 8AM-5PM |
| IT Support | (301) 555-4357 | 24/7 |
| Facilities | (301) 555-3278 | 24/7 |
| Safety | (301) 555-7233 | Mon-Fri 8AM-5PM |

### Portal URLs:

- **Landing:** https://ugochi141.github.io/largo-lab-portal
- **Staff:** https://ugochi141.github.io/largo-lab-portal/staff
- **Admin:** https://ugochi141.github.io/largo-lab-portal/admin

### Portal Features:

| Feature | Available | Editable |
|---------|-----------|----------|
| SOPs | ✅ Yes | ❌ No |
| Schedule | ✅ Yes | ❌ No |
| QC Maintenance | ✅ Yes | ❌ No |
| Inventory | ✅ Yes | ❌ No |
| Tech Support | ✅ Yes | ❌ No |

---

## ❓ FAQ

**Q: Can I download SOPs?**  
A: No, staff portal has view-only access. Contact admin for PDF copies.

**Q: How do I place an order?**  
A: You cannot place orders in staff portal. Notify your supervisor or admin about low stock items.

**Q: Can I change my schedule?**  
A: No, contact your supervisor for schedule changes.

**Q: Why can't I click some buttons?**  
A: Gray disabled buttons indicate actions not available in read-only mode.

**Q: How often is data updated?**  
A: Inventory: Real-time | Schedule: Daily | QC: Real-time | SOPs: As needed

**Q: Can I access admin portal?**  
A: No, admin portal requires administrator credentials.

**Q: What if I need full access?**  
A: Contact Lab Director at (301) 555-0101 to request permissions.

**Q: Is my browsing tracked?**  
A: Basic usage analytics are collected for system improvement. No personal browsing data is shared.

**Q: Can I use this on my phone?**  
A: Yes! The portal is fully mobile responsive.

**Q: What browsers are supported?**  
A: Chrome, Firefox, Safari, Edge (latest versions recommended)

---

## 📚 Additional Resources

### Documentation:

- Full Stack Assessment Report
- API Connection Guide
- Administrator Guide (admin only)

### Training:

- New Employee Portal Orientation
- Laboratory Information Systems Training
- Safety & Compliance Training

### Support:

- IT Helpdesk: helpdesk@kp.org
- Lab Admin: admin@largo-lab.kp.org
- Safety: safety@kp.org

---

**Remember:** This is a **read-only portal**. You can view all information but cannot make changes. Contact your administrator for any modifications needed.

**Questions?** Contact Lab Director: (301) 555-0101 or admin@largo-lab.kp.org

---

*Last Updated: November 19, 2025*  
*Largo Laboratory Portal v4.2.0*  
*© 2025 Kaiser Permanente*
