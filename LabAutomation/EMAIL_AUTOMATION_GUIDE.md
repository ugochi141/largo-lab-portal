# 📧 Lab Inventory Email Automation System

## Overview

The inventory system now automatically monitors stock levels and emails Nathaniel Burmeister (Supply Coordinator) when items need ordering. The system checks PAR levels, reorder points, and expiration dates to generate comprehensive order requests.

## 🚀 How It Works

### 1. **Automatic Monitoring**
- Checks all items against their reorder points
- Identifies critical shortages (out of stock)
- Flags expiring items (like ALT reagents)
- Calculates optimal order quantities

### 2. **Email Generation**
The system creates a professional HTML email with:
- **🔴 CRITICAL** - Out of stock items
- **🟡 URGENT** - Below minimum stock
- **🟢 ROUTINE** - Standard reorders
- **⚠️ EXPIRING** - Items needing redistribution

### 3. **Smart Recipients**
- **To:** Nathaniel Burmeister (Supply Coordinator)
- **CC:** Lorraine, Ingrid (Inventory Managers)
- **Urgent CC:** John F Ekpe, Maxwell Booker (for critical items)

## 📋 Email Contents

### What's Included:
1. **Item Description** - Full product name
2. **Manufacturer** - Roche, Sysmex, etc.
3. **Catalog Number** - For accurate ordering
4. **Supplier ID** - With verification flags
5. **Package Size** - 800 tests, 20L, etc.
6. **Current Stock** - Hand count
7. **Order Quantity** - Calculated to reach PAR
8. **Location** - MOB/AUC delivery instructions

### Special Alerts:
- ALT reagent excess (25 vs PAR of 8)
- Supplier IDs needing verification
- MEDTOX QC logging reminders
- Delivery split instructions

## 🔧 Configuration

### Email Settings (`email_config.json`):
```json
{
  "email_settings": {
    "smtp_server": "smtp.kaiser.org",
    "sender_email": "lab.inventory@kaiser.org",
    "sender_name": "Largo Lab Inventory System"
  },
  "recipients": {
    "supply_coordinator": {
      "name": "Nathaniel Burmeister",
      "email": "nathaniel.burmeister@kaiser.org"
    }
  },
  "schedule": {
    "daily_check_time": "07:00",
    "weekly_summary_day": "Monday",
    "auto_send": false
  }
}
```

## 🕐 Scheduling Options

### Manual Run:
```bash
python3 scripts/inventory_email_automation.py
```

### Scheduled Runs:
```bash
# Check status
python3 scripts/schedule_inventory_checks.py --status

# Force run
python3 scripts/schedule_inventory_checks.py --force

# Set up daily automation
python3 scripts/schedule_inventory_checks.py --setup
```

### Automated Schedule:
- **Daily:** 7:00 AM Monday-Friday
- **Weekly Summary:** Monday 2:00 PM
- **Critical Items:** Immediate notification

## 📊 Example Email Output

### From Today's Check:
```
Subject: Lab Supply Order Request - 2025-09-10

⚠️ URGENT: EXPIRING ITEMS - ACTION REQUIRED
ALT Reagent Pack
Current Stock: 25 packs
PAR Level: 8 packs
EXCESS TO REDISTRIBUTE: 17 packs
Contact other Kaiser locations immediately!

🟡 URGENT - LOW STOCK ITEMS
MEDTOX Negative Control
Current: 1, Order: 4 boxes
Supplier ID: 10283225
```

## 🎯 Implementation Steps

### 1. **Test Mode** (Current):
- Generates test email as HTML file
- No actual emails sent
- Review `test_order_email.html`

### 2. **Production Mode**:
1. Update SMTP credentials in `email_config.json`
2. Set `"auto_send": true`
3. Configure email password securely
4. Test with IT department

### 3. **Daily Automation**:
1. Run setup command
2. Add to system scheduler/cron
3. Monitor `inventory_automation.log`

## 🚨 Current Alerts

Based on today's inventory check:

1. **ALT Reagents** - 17 packs excess, expire Oct 31
2. **MEDTOX Negative Control** - Only 1 box remaining
3. **Supplier IDs** - Several need verification

## 📈 Benefits

1. **Prevents Stockouts** - Automatic reorder alerts
2. **Reduces Waste** - Expiration tracking
3. **Saves Time** - No manual checking needed
4. **Improves Accuracy** - All info in one email
5. **Creates Accountability** - Email trail for orders

## 🔐 Security Notes

- Email passwords stored securely (not in code)
- HIPAA-compliant internal email only
- No patient data in emails
- Audit trail maintained

## 📞 Support

**Technical Issues:** IT Help Desk
**Inventory Questions:** Lorraine or Ingrid
**Supply Orders:** Nathaniel Burmeister
**System Updates:** Lab IT Administrator

---

*The email automation system ensures critical supplies are never out of stock while preventing waste from expired items like the current ALT reagent situation.*



