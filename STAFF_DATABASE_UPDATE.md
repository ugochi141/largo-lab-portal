# Staff Database Update - November 2, 2025

## Summary
Removed Lorraine Blackwell and Samuel Lawson from the active staff database while preserving their historical schedule data.

---

## Changes Made

### File Updated:
**`Schedules/ScheduleManager.js`** (Lines 75, 80)

### Staff Removed from Active Database:

#### 1. Lorraine Blackwell
- **Position:** MLA (Medical Laboratory Assistant)
- **Former Shift:** 8:00a-4:30p
- **Former Assignment:** MOB Support - Assist QC/Maint, Urines, Kits ONLY
- **Status:** Marked as "No longer active staff"

#### 2. Samuel Lawson
- **Position:** MLS (Medical Laboratory Scientist)
- **Former Shift:** 3:30p-12:00a (Evening)
- **Former Assignment:** AUC Evening - Processing
- **Status:** Marked as "No longer active staff"

---

## Impact Analysis

### ✅ What Changed:
1. **New schedule generation** will no longer include these staff members
2. **Auto-generated templates** updated to current active staff only
3. **Comments added** to mark removal date and reason

### ✅ What Stayed the Same:
1. **Historical schedule data** preserved in existing dates
2. **Past records** remain intact for audit purposes
3. **No data loss** - all previous schedules accessible

---

## Current Active Staff Count

### Laboratory Staff (After Removal):
**Day Shift:**
- Francis Azih Ngene (MLS) - 7:30a-4:00p
- Dat Chu (MLS) - 7:00a-2:30p
- Steeven Brussot (MLT) - 8:00a-4:30p

**Evening Shift:**
- Ogheneochuko Eshofa (Tracy) (MLT) - 3:30p-12:00a
- Albert Che (MLS) - 3:30p-12:00a

**Night Shift:**
- Emmanuel Lejano (Boyet) (MLT) - 9:30p-6:00a
- George Etape (MLS) - 11:30p-8:00a

**Total Active Lab Staff:** 7 (was 9)

### Phlebotomy Staff (Unchanged):
**Day Shift:**
- Christina Bolden-Davis - 6:00a-2:30p
- Youlana Miah - 6:00a-2:30p
- Johnette Brooks (Netta) - 7:00a-3:30p
- Cheryl Gray - 8:00a-4:30p
- Anne Saint Phirin - 8:00a-4:30p
- Raquel Grayson - 9:00a-5:30p
- Emmanuella Theodore (Emma) - 9:00a-5:30p

**Evening Shift:**
- Stephanie Dodson - 2:00p-10:30p
- Nichole Fauntleroy - 2:00p-10:30p
- Danalisa Hayes - 2:00p-10:30p

**Total Phlebotomy Staff:** 10

---

## Code Changes

### Before:
```javascript
{name: 'Lorraine Blackwell', nickname: 'Lorraine', dept: 'MLA', assignment: 'MOB Support - Assist QC/Maint, Urines, Kits ONLY', shift: '8:00a-4:30p', breaks: 'Break 1: 10:00a-10:15a | Lunch: 12:30p-1:00p | Break 2: 2:45p-3:00p', startTime: 8},
{name: 'Samuel Lawson', nickname: 'Samuel', dept: 'MLS', assignment: 'AUC Evening - Processing', shift: '3:30p-12:00a', breaks: 'Break 1: 5:30p-5:45p | Lunch: 7:45p-8:15p | Break 2: 10:30p-10:45p', startTime: 15.5},
```

### After:
```javascript
// Lorraine Blackwell - REMOVED (No longer active staff)
// Samuel Lawson - REMOVED (No longer active staff)
```

---

## Testing Recommendations

### To Verify Changes:
1. Generate a new schedule using Schedule Manager
2. Confirm Lorraine and Samuel do NOT appear
3. Check that historical schedules still show them correctly
4. Verify current active staff appear as expected

### Commands to Test:
```javascript
// In browser console on schedule pages:
const manager = new ScheduleManager();
const newSchedule = manager.generateScheduleFromTemplate('2025-11-03', 'standard');
console.log('Lab staff:', newSchedule.lab.map(s => s.name));
// Should NOT include "Lorraine Blackwell" or "Samuel Lawson"
```

---

## Next Steps (Optional)

### If You Want to Also Remove from Historical Data:
The current approach keeps them in historical schedules. If you want to remove them completely:

1. **Option A:** Clear localStorage cache
   - Opens any schedule page
   - Click "Clear Cache" button
   - Confirms removal of all cached data

2. **Option B:** Manually edit historical data
   - Would require editing multiple date entries
   - Not recommended unless necessary for compliance

### Recommended Action:
**Keep historical data as-is** for:
- Audit trail compliance
- Payroll verification
- Historical record accuracy
- Regulatory requirements (CLIA, CAP)

---

## Git Commit Details

**Commit:** `1f71fc8`  
**Message:** "fix: Remove Lorraine Blackwell and Samuel Lawson from active staff database"  
**Date:** November 2, 2025  
**Branch:** main  
**Status:** ✅ Pushed to GitHub

---

## Questions?

If you need to:
- Add new staff members to the database
- Modify existing staff assignments
- Change shift times or break schedules
- Update QC assignments

Refer to the `ScheduleManager.js` file (lines 54-103) or contact the system administrator.

---

**Document Generated:** November 2, 2025  
**Last Updated:** November 2, 2025  
**Status:** Complete ✅
