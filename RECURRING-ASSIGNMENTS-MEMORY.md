# Recurring Staff Assignments - Memory Note
## Kaiser Permanente Largo Laboratory

**Last Updated:** November 5, 2025

---

## Tuesday/Thursday Recurring Assignments

### Laboratory Staff

#### 2nd Review Task - QC and Maintenance Verification
**Alternates Every Other Week:**

- **Week 1 (Nov 5-8):** Albert Che
  - Assignment: "2nd Review - Verify QC and Maintenance Completed [TUE/THU]"
  - Shift: 3:30p-12:00a (Evening)
  - Dates: Tuesday Nov 5, Thursday Nov 7

- **Week 2 (Nov 9-15):** Francis Azih Ngene
  - Assignment: "2nd Review - Verify QC and Maintenance Completed [TUE/THU]"
  - Shift: 7:30a-4:00p (Day)
  - Dates: Tuesday Nov 11, Thursday Nov 13

**Alternation Pattern:**
```
Week 1 (Nov 5-8):    Albert  (Tue 11/5, Thu 11/7)
Week 2 (Nov 9-15):   Francis (Tue 11/11, Thu 11/13)
Week 3 (Nov 16-22):  Albert  (Tue 11/18, Thu 11/20)
Week 4 (Nov 23-29):  Francis (Tue 11/25, Thu 11/27)
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

- **George Etape (MLS)**
  - Assignment: "Inventory AUC and MOB [TUE/THU]"
  - Shift: 11:30p-8:00a (Night)
  - Note: Night shift inventory coverage

### Phlebotomy Staff

#### Inventory - Phlebotomy and Specimen Processing
**Anytime Christina is scheduled:**

- **Christina Bolden-Davis**
  - Assignment: "Inventory Phleb/Specimen Processing"
  - Shift: Varies (typically 6:00a-2:30p)
  - Note: **ALWAYS assign this whenever Christina is on shift** (not just Tue/Thu)

---

## Implementation Notes

### When Creating Tuesday/Thursday Schedules:

1. **Check which week** for 2nd Review assignment:
   - Week 1 (Nov 5-8): Albert
   - Week 2 (Nov 9-15): Francis
   - Week 3 (Nov 16-22): Albert
   - Week 4 (Nov 23-29): Francis

2. **Always add to Booker, Emily, and George (every Tue/Thu):**
   - "Inventory AUC and MOB [TUE/THU]"

3. **Whenever Christina is scheduled (ANY day), add:**
   - "Inventory Phleb/Specimen Processing"

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

// George (every Tue/Thu)
{
  name: 'George Etape',
  nickname: 'George',
  dept: 'MLS',
  assignment: 'AUC Night Coverage - Pure 2 QC @3am [DAILY], MiniSed QC [DAILY], GeneXpert QC [DAILY], Inventory AUC and MOB [TUE/THU], Wipe Benches, Clean Microscopes, Log QC'
}

// Christina (ANYTIME she's scheduled - not just Tue/Thu)
{
  name: 'Christina Bolden-Davis',
  nickname: 'Christina',
  assignment: 'Draw Patients/Opener',
  notes: 'Inventory Phleb/Specimen Processing'
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
| Week 1 | Nov 5-8 (Tue-Fri) | **Albert** | Booker, Emily, George | Christina (whenever scheduled) |
| Week 2 | Nov 9-15 (Sun-Sat) | **Francis** | Booker, Emily, George | Christina (whenever scheduled) |
| Week 3 | Nov 16-22 (Sun-Sat) | **Albert** | Booker, Emily, George | Christina (whenever scheduled) |
| Week 4 | Nov 23-29 (Sun-Sat) | **Francis** | Booker, Emily, George | Christina (whenever scheduled) |

---

## Quick Reference

**Question:** Who does 2nd Review this week?
**Answer:**
- Week 1 (Nov 5-8): Albert
- Week 2 (Nov 9-15): Francis
- Week 3 (Nov 16-22): Albert
- Week 4 (Nov 23-29): Francis

**Question:** Who does lab inventory on Tuesdays/Thursdays?
**Answer:** Always Booker, Emily, and George.

**Question:** Who does phleb inventory?
**Answer:** Christina, anytime she's scheduled (not just Tue/Thu).

---

**Maintained By:** Laboratory Scheduling Team
**Review Frequency:** Monthly
**Next Review:** December 2025
