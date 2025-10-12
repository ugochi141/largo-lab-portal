# 🧪 Largo Lab Inventory Management Solution

## Executive Summary

This comprehensive solution addresses the inventory management issues discussed in the tech meeting with Nathaniel Burmeister, including supply shortages, incorrect supplier IDs, and the urgent need to manage expiring ALT reagents.

## 📋 Solution Overview

### Files Created:
1. **LARGO_LAB_INVENTORY_TEMPLATE_COMPLETE.xlsx** - Master inventory tracking spreadsheet
2. **Enhanced inventory consolidation scripts** - For ongoing maintenance
3. **This guide** - Complete implementation instructions

## 🚨 Immediate Actions Required

### 1. ALT Reagent Crisis (Due: Before October 31, 2025)
- **Issue**: 25 reagent packs expire end of October
- **Solution**: 
  - Split inventory list between MOB and AUC labs
  - Contact other Kaiser locations for redistribution
  - Use oldest lots first (FIFO principle)
  - Track usage in EXPIRING_ITEMS sheet

### 2. Supplier ID Corrections
- **Issue**: Multiple incorrect supplier IDs found by Maxwell Booker
- **Solution**:
  - Review all supplier IDs in the template
  - Cross-reference with packing slips
  - Update in SUPPLIER ID column
  - Note corrections in NOTES column

### 3. Staff Communication
- **Issue**: Coordination needed between labs during staff shortages
- **Solution**:
  - Primary assignments documented in SUMMARY sheet
  - Backup procedures clearly defined
  - Real-time updates via shared spreadsheet

## 📊 Inventory Template Features

### Sheet Structure:
1. **SUMMARY** - Dashboard with alerts, staff assignments, quick reference
2. **CHEMISTRY** - Including Roche consumables, reagents, electrodes
3. **HEMATOLOGY** - CBC controls, Sysmex supplies
4. **URINALYSIS** - Test strips, controls, collection supplies
5. **KITS** - MEDTOX and other test kits
6. **MISCELLANEOUS** - Thermometers, pipettes, general supplies
7. **EXPIRING_ITEMS** - Critical tracking for time-sensitive items

### Key Columns:
- **DESCRIPTION** - Item name
- **MATERIAL# (KAISER#/OLID)** - Kaiser system number
- **SUPPLIER ID** - For ordering (needs verification)
- **ONELINK NUMBER** - Alternative ordering system
- **PAR LEVEL** - Minimum stock level
- **HAND COUNT** - Current physical count
- **REQ QTY** - Amount to order
- **STATUS** - Auto-calculated (OK/LOW STOCK/OUT OF STOCK)
- **LOCATION** - MOB/AUC/BOTH with dropdown
- **EXPIRATION DATE** - Critical for reagents
- **NOTES** - Important information and issues

## 👥 Staff Responsibilities

### Primary Roles:
- **Lorraine** - Primary inventory manager, urine processing
- **Ingrid** - Secondary manager, coordinates overflow
- **Mimi** - Backup for urine pour-offs
- **Maxwell Booker** - Identified supplier ID issues
- **Nathaniel Burmeister** - Supply list generation, ordering

### Daily Tasks:
1. Update hand counts at assigned bench
2. Check for low stock items (<10)
3. Verify supplier IDs on new deliveries
4. Note any discrepancies

## 🔄 Implementation Process

### Week 1: Initial Setup
1. **Day 1-2**: 
   - Open LARGO_LAB_INVENTORY_TEMPLATE_COMPLETE.xlsx
   - Distribute to team via Teams/SharePoint
   - Grant edit permissions to Lorraine, Ingrid, and techs

2. **Day 3-4**:
   - Conduct physical inventory count
   - Fill in all HAND COUNT fields
   - Identify and mark incorrect supplier IDs

3. **Day 5**:
   - Review with Nathaniel Burmeister
   - Submit orders for critical items
   - Plan ALT reagent redistribution

### Week 2: Training & Refinement
1. **Training Sessions**:
   - 30-minute session for each shift
   - Cover update procedures
   - Practice using dropdowns and formulas

2. **Process Documentation**:
   - Post quick reference guides at each bench
   - Create laminated instruction cards
   - Set up Teams channel for questions

### Ongoing: Maintenance
1. **Daily**: Update counts, check alerts
2. **Weekly**: Review expiring items, submit orders
3. **Monthly**: Full inventory audit, supplier ID verification

## 📱 Technical Setup

### SharePoint/Teams Integration:
```
1. Upload file to Teams > Files > Largo Lab Inventory
2. Set permissions: 
   - Lorraine, Ingrid: Edit
   - All techs: Edit
   - Nathaniel: Owner
3. Enable co-authoring for real-time updates
4. Set up notifications for changes
```

### Mobile Access:
- Use Teams mobile app for updates at bench
- Excel mobile app for full functionality
- Quick edits via browser

## 🚦 Status Indicators

### Automatic Color Coding:
- 🟢 **Green (OK)**: Adequate stock
- 🟡 **Yellow (LOW STOCK)**: Count < 10
- 🟠 **Orange (BELOW PAR)**: Below minimum level
- 🔴 **Red (OUT OF STOCK)**: Count = 0
- 🟣 **Purple (EXPIRING)**: Within 60 days of expiration

## 📈 Metrics & Reporting

### Key Performance Indicators:
1. Stock-out incidents per month
2. Expired item waste percentage
3. Order accuracy (correct supplier IDs)
4. Update compliance (daily counts entered)

### Monthly Reports:
- Generate from SUMMARY sheet
- Review in tech meetings
- Adjust PAR levels based on usage

## 🆘 Troubleshooting

### Common Issues:
1. **Can't edit spreadsheet**: Check Teams permissions
2. **Formula errors**: Don't delete formula cells
3. **Sync issues**: Save and refresh
4. **Missing items**: Add new rows, copy formulas

### Support Contacts:
- **Technical Issues**: IT Help Desk
- **Supply Questions**: Nathaniel Burmeister
- **Process Questions**: Lorraine or Ingrid

## 💡 Best Practices

1. **Clock-in Policy**: Get manager approval before clocking in early for inventory
2. **Pour-off Procedures**: Always verify with processor
3. **QC Documentation**: Log in both Cerner AND maintenance binders
4. **Overflow Protocol**: Communicate via Teams before sending to other lab
5. **PTO Reminders**: Submit by quarterly deadlines per labor contract

## 📅 Timeline

### Immediate (This Week):
- Deploy inventory template
- Address ALT reagent expiration
- Correct known supplier ID errors

### Short-term (Next 30 Days):
- Complete staff training
- Establish daily update routine
- Implement Teams notifications

### Long-term (Next Quarter):
- Automate reorder notifications
- Integrate with Kaiser procurement system
- Develop predictive ordering based on usage patterns

## ✅ Success Criteria

1. Zero stock-outs for critical items
2. No expired reagent waste
3. 100% supplier ID accuracy
4. Daily inventory updates completed
5. Improved lab-to-lab coordination

## 📝 Notes from Tech Meeting

Key points raised:
- Pneumatic tube system now functional - update procedures
- CBC's can be run at MOB Lab - adjust workflows
- MEDTOX QC must be logged in Cerner
- Staff can clock in 30 min early for inventory with approval
- Q4 PTO deadline reminder for union staff

---

## 🎯 Quick Start Checklist

- [ ] Download LARGO_LAB_INVENTORY_TEMPLATE_COMPLETE.xlsx
- [ ] Upload to Teams/SharePoint
- [ ] Set edit permissions for all users
- [ ] Conduct initial inventory count
- [ ] Identify ALT reagents for redistribution
- [ ] Verify supplier IDs with packing slips
- [ ] Schedule staff training sessions
- [ ] Post quick reference guides
- [ ] Set up daily update reminders
- [ ] Plan weekly review meetings

---

*For questions or support, contact Nathaniel Burmeister or the inventory team leads (Lorraine/Ingrid)*

*Last Updated: September 2025*



