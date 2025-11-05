# Recurring Staff Assignments - Memory Note
## Kaiser Permanente Largo Laboratory

**Last Updated:** November 4, 2025

---

## Tuesday/Thursday Recurring Assignments

### Laboratory Staff

#### 2nd Review Task - QC and Maintenance Verification
**Alternates Every Other Week:**

- **Week 1 (Nov 4, 11, 18, 25):** Albert Che
  - Assignment: "2nd Review - Verify QC and Maintenance Completed [TUE/THU]"
  - Shift: 3:30p-12:00a (Evening)

- **Week 2 (Nov 11, 25):** Francis Azih Ngene
  - Assignment: "2nd Review - Verify QC and Maintenance Completed [TUE/THU]"
  - Shift: 7:30a-4:00p (Day)

**Alternation Pattern:**
```
Week of Nov 4:  Albert
Week of Nov 11: Francis
Week of Nov 18: Albert
Week of Nov 25: Francis
```

#### Inventory - AUC and MOB
**Every Tuesday and Thursday:**

- **Maxwell Booker (MLT)**
  - Assignment: "Inventory AUC and MOB [TUE/THU]"
  - Shift: 7:30a-4:00p (Day)
  - Note: Works MOB location

- **Emily Creekmore (MLT)**
  - Assignment: "Inventory AUC and MOB [TUE/THU]"
  - Shift: 7:30a-4:00p (Day)
  - Note: Works AUC Front

### Phlebotomy Staff

#### Inventory - Phlebotomy and Specimen Processing
**Every Tuesday and Thursday:**

- **Christina Bolden-Davis**
  - Assignment: "Inventory Phleb/Specimen Processing [TUE/THU]"
  - Shift: 6:00a-2:30p (Opener)
  - Note: Only on days when Christina is scheduled

---

## Implementation Notes

### When Creating Tuesday/Thursday Schedules:

1. **Check which week** for 2nd Review assignment:
   - Odd weeks (1st, 3rd): Albert
   - Even weeks (2nd, 4th): Francis

2. **Always add to Booker and Emily:**
   - "Inventory AUC and MOB [TUE/THU]"

3. **If Christina is scheduled, add:**
   - "Inventory Phleb/Specimen Processing [TUE/THU]"

### Assignment Format Examples:

```javascript
// Francis (when his week)
{
  name: 'Francis Azih Ngene',
  nickname: 'Francis',
  dept: 'MLS',
  assignment: 'AUC Back - Hematology, Chemistry, Molecular, MedTox QC [DAILY], Sysmex Startup/QC [DAILY], Hematek Startup/QC [DAILY], 2nd Review - Verify QC and Maintenance Completed [TUE/THU], Stago Maint, Wipe Benches, Clean Microscopes, Log QC'
}

// Albert (when his week)
{
  name: 'Albert Che',
  nickname: 'Albert',
  dept: 'MLS',
  assignment: 'AUC Evening - Processing, 2nd Review - Verify QC and Maintenance Completed [TUE/THU], Wipe Benches, Clean Microscopes, Log QC'
}

// Booker (every Tue/Thu)
{
  name: 'Maxwell Booker',
  nickname: 'Booker',
  dept: 'MLT',
  assignment: 'MOB - Pure 1 QC @7:30am [DAILY], Kits QC [DAILY], Previ Gram Stain [WEEKLY-Tue MOB], Novus [WEEKLY-Tue MOB Day], Inventory AUC and MOB [TUE/THU], Stago Maint, Wipe Benches, Clean Microscopes, Log QC'
}

// Emily (every Tue/Thu)
{
  name: 'Emily Creekmore',
  nickname: 'Emily',
  dept: 'MLT',
  assignment: 'AUC Front - Processing/Urines, Kits QC [DAILY], Inventory AUC and MOB [TUE/THU], Stago Maint, Wipe Benches, Clean Microscopes, Log QC'
}

// Christina (every Tue/Thu when scheduled)
{
  name: 'Christina Bolden-Davis',
  nickname: 'Christina',
  assignment: 'Draw Patients/Opener',
  notes: 'Inventory Phleb/Specimen Processing [TUE/THU]'
}
```

---

## Assignment Purposes

### 2nd Review - QC and Maintenance Verification
**Purpose:** Quality assurance double-check
- Verify all daily QC has been completed and logged
- Confirm all maintenance tasks are done
- Review all instrument logs for completeness
- Ensure no pending tasks before end of shift
- Report any discrepancies to supervisor

**When:** End of day shift (Francis) or end of evening shift (Albert)

### Inventory - AUC and MOB
**Purpose:** Stock level monitoring
- Check PAR levels for all inventory items
- Identify items below reorder point
- Coordinate with inventory system
- Report shortages to manager
- Prepare orders for Thursday delivery

**When:** Mid-shift on Tuesday and Thursday
**Locations:** Both AUC and MOB sites

### Inventory - Phlebotomy/Specimen Processing
**Purpose:** Phlebotomy supplies monitoring
- Check needles, tubes, tourniquets
- Verify specimen processing supplies
- Maintain adequate stock levels
- Report shortages immediately
- Coordinate restocking

**When:** Morning shift on Tuesday and Thursday
**Locations:** Phlebotomy draw stations and specimen processing area

---

## Schedule Rotation Calendar (November 2025)

| Week | Dates | 2nd Review Person | Inventory (Lab) | Inventory (Phleb) |
|------|-------|-------------------|-----------------|-------------------|
| Week 1 | Nov 4-5 (Tue-Thu) | **Albert** | Booker, Emily | Christina (if scheduled) |
| Week 2 | Nov 11-12 (Tue-Thu) | **Francis** | Booker, Emily | Christina (if scheduled) |
| Week 3 | Nov 18-19 (Tue-Thu) | **Albert** | Booker, Emily | Christina (if scheduled) |
| Week 4 | Nov 25-26 (Tue-Thu) | **Francis** | Booker, Emily | Christina (if scheduled) |

---

## Quick Reference

**Question:** Who does 2nd Review this week?
**Answer:** Check the week number. Week 1 = Albert, Week 2 = Francis, alternating.

**Question:** Who does lab inventory on Tuesdays/Thursdays?
**Answer:** Always Booker and Emily.

**Question:** Who does phleb inventory on Tuesdays/Thursdays?
**Answer:** Christina (when she's scheduled).

---

**Maintained By:** Laboratory Scheduling Team
**Review Frequency:** Monthly
**Next Review:** December 2025
