# AUC Staffing Models - Memory Note
## Kaiser Permanente Largo Laboratory

**Last Updated:** November 5, 2025

---

## Shift Timing Guidelines

### Beginning Shift Start Time
**Standard Opening:** 5:00am

The beginning/opening shift for laboratory operations starts at **5:00am**. This is the earliest technician start time for day operations, ensuring:
- Pre-opening equipment warm-up and startup procedures
- Early morning specimen processing readiness
- QC completion before patient testing begins
- Smooth transition from night shift

**Common Beginning Shift Examples:**
- Opener techs: 5:00a-1:30p
- Early processors: 5:00a-1:30p
- Equipment startup specialists: 5:00a-1:30p

---

## Bench Assignment Guidelines by Staffing Level

### AUC Day Shift - Two Techs
When staffing AUC day shift with 2 technicians, divide work as follows:

**AUC Front (Tech 1):**
- Processing/Urines
- Kits
- Stago

**AUC Back (Tech 2):**
- Hematology
- Chemistry
- Molecular

### AUC Day Shift - Three Techs
When staffing AUC day shift with 3 technicians, divide work as follows:

**CRITICAL: Schedule Entry Order**
When creating schedules with 3 day techs, list them in this EXACT order:
1. **First:** Tech 2 (Processing)
2. **Second:** Tech 1 (Urines, Kits, Coag)
3. **Third:** Tech 3 (Hematology, Chemistry, Molecular)

**Tech 1 - AUC/Urines, Kits, and Coag:**
- Urines
- Kits
- Coagulation (Stago)
- Stago Maint
- ESR 10% Check QC [DAILY]

**Tech 2 - AUC/Processing:**
- Specimen Processing
- Support as needed

**Tech 3 - AUC/Hematology, Chemistry, Molecular:**
- Hematology
- Chemistry
- Molecular

**Assignment Format Examples:**
```javascript
// CORRECT ORDER: Tech 2, then Tech 1, then Tech 3

// Tech 2 - Processing (Emily)
{
  name: 'Emily Creekmore',
  nickname: 'Emily',
  dept: 'MLT',
  shift: '7:30a-4:00p',
  assignment: 'AUC - Processing, Inventory AUC and MOB [TUE/THU], Wipe Benches, Clean Microscopes, Log QC',
  breaks: 'Break 1: 9:30a-9:45a | Lunch: 12:00p-12:30p | Break 2: 2:30p-2:45p',
  startTime: 7.5
},

// Tech 1 - Urines/Kits/Coag (Booker)
{
  name: 'Maxwell Booker',
  nickname: 'Booker',
  dept: 'MLT',
  shift: '7:30a-4:00p',
  assignment: 'AUC - Urines, Kits, Coag/Stago, Kits QC [DAILY], Inventory AUC and MOB [TUE/THU], Stago Maint, Wipe Benches, Clean Microscopes, Log QC',
  breaks: 'Break 1: 9:45a-10:00a | Lunch: 12:30p-1:00p | Break 2: 2:45p-3:00p',
  startTime: 7.5
},

// Tech 3 - Hematology/Chemistry/Molecular (Ingrid)
{
  name: 'Ingrid Benitez-Ruiz',
  nickname: 'Ingrid',
  dept: 'MLS',
  shift: '7:30a-4:00p',
  assignment: 'AUC - Hematology, Chemistry, Molecular, MedTox QC [DAILY], Sysmex Startup/QC [DAILY], Hematek Startup/QC [DAILY], Wipe Benches, Clean Microscopes, Log QC',
  breaks: 'Break 1: 10:00a-10:15a | Lunch: 1:00p-1:30p | Break 2: 3:00p-3:15p',
  startTime: 7.5
}
```

**IMPORTANT NOTES:**
- Do NOT use "AUC Front" or "AUC Back" terminology for three-tech schedules
- Use "AUC - [specific responsibilities]" format
- List in order: Tech 2 (Processing), Tech 1 (Urines/Kits/Coag), Tech 3 (Analyzers)

### MOB Day Shift - One Tech (MLA)
When staffing MOB with 1 MLA (Medical Laboratory Assistant):

**MLA Responsibilities:**
- SQA Daily [DAILY]
- Hematek Daily QC [DAILY]
- Previ Gram Stain
- Patient Support
- Inventory
- Urines (MLA Restriction)
- Kits QC (MLA Restriction)

**Note:** MLAs cannot perform complex testing; restricted to basic QC, patient support, and routine tasks.

---

## AUC Position Designations

### Day Shift (7:00a-4:30p)

#### AUC Back
**Primary Responsibilities:**
- Hematology analyzers
- Chemistry analyzers
- Molecular testing
- MedTox QC [DAILY]
- Sysmex Startup/QC [DAILY]
- Hematek Startup/QC [DAILY]
- Stago Maintenance
- Wipe Benches, Clean Microscopes, Log QC

**Typical Staffing:** 1 MLS

**Example Assignment:**
```javascript
{
  name: 'Francis Azih Ngene',
  dept: 'MLS',
  shift: '7:30a-4:00p',
  assignment: 'AUC Back - Hematology, Chemistry, Molecular, MedTox QC [DAILY], Sysmex Startup/QC [DAILY], Hematek Startup/QC [DAILY], Stago Maint, Wipe Benches, Clean Microscopes, Log QC'
}
```

#### AUC Front
**Primary Responsibilities:**
- Specimen processing
- Urinalysis
- Kits QC [DAILY]
- Stago Maintenance
- Wipe Benches, Clean Microscopes, Log QC

**Typical Staffing:** 1 MLT

**Example Assignment:**
```javascript
{
  name: 'Emily Creekmore',
  dept: 'MLT',
  shift: '7:30a-4:00p',
  assignment: 'AUC Front - Processing/Urines, Kits QC [DAILY], Stago Maint, Wipe Benches, Clean Microscopes, Log QC'
}
```

---

### Evening Shift (3:30p-12:00a)

#### AUC Evening
**Primary Responsibilities:**
- Processing specimens
- Urinalysis
- Kits
- Stago
- ESR 10% Check QC [DAILY]
- Stago Maintenance
- Wipe Benches, Clean Microscopes, Log QC

**Typical Staffing:** 2-3 techs

**Example Assignments:**
```javascript
// Evening Tech 1 (Urines/Kits)
{
  name: 'Ogheneochuko Eshofa',
  nickname: 'Tracy',
  dept: 'MLT',
  shift: '3:30p-12:00a',
  assignment: 'AUC Evening - Urines, Kits, Stago, ESR 10% Check QC [DAILY], Stago Maint, Wipe Benches, Clean Microscopes, Log QC'
}

// Evening Tech 2 (Processing)
{
  name: 'Albert Che',
  dept: 'MLS',
  shift: '3:30p-12:00a',
  assignment: 'AUC Evening - Processing, Wipe Benches, Clean Microscopes, Log QC'
}

// Evening Tech 3 (if needed)
{
  name: 'Lionel Ndifor',
  dept: 'MLT',
  shift: '3:30p-12:00a',
  assignment: 'AUC Evening - Processing, Wipe Benches, Clean Microscopes, Log QC'
}
```

---

## AUC Night Coverage Models

### 2-Tech Model (Standard)
**When to Use:** Normal weeknights, lower volume

**Staffing:**
- **Tech 1:** MLS - 11:30p-8:00a (Lead tech)
- **Tech 2:** MLS - 12:00a-6:30a (Support/On-call)

**Example:**
```javascript
// Tech 1 - Lead Night Tech
{
  name: 'George Etape',
  nickname: 'George',
  dept: 'MLS',
  shift: '11:30p-8:00a',
  assignment: 'AUC Night Coverage - Pure 2 QC @3am [DAILY], MiniSed QC [DAILY], GeneXpert QC [DAILY], Wipe Benches, Clean Microscopes, Log QC',
  breaks: 'Break 1: 1:30a-1:45a | Lunch: 3:45a-4:15a | Break 2: 6:00a-6:15a',
  startTime: 23.5
}

// Tech 2 - Support Tech (Often on-call)
{
  name: 'Jacqueline Liburd',
  nickname: 'Jackie',
  dept: 'MLS',
  shift: '12:00a-6:30a',
  assignment: 'AUC Night Coverage - MiniSed QC [DAILY], Wipe Benches, Clean Microscopes, Log QC',
  breaks: 'Break 1: 1:45a-2:00a | Lunch: 4:15a-4:45a',
  notes: 'On-call shift',
  startTime: 0
}
```

**Responsibilities Distribution:**
- **Tech 1 (George):**
  - Pure 2 QC @3am [DAILY]
  - MiniSed QC [DAILY]
  - GeneXpert QC [DAILY]
  - Weekly tasks (Novus on Tuesdays after 3am)
  - Primary responsibility for all critical QC

- **Tech 2 (Jackie):**
  - MiniSed QC [DAILY] (backup/verification)
  - Support Tech 1 with workload
  - Cover breaks
  - Handle overflow

---

### 3-Tech Model (High Volume)
**When to Use:** Busy nights, Mondays, holidays, high volume periods

**Staffing:**
- **Tech 1:** MLT - 9:30p-6:00a (Early night)
- **Tech 2:** MLS - 11:30p-8:00a (Lead tech)
- **Tech 3:** MLS - 12:00a-6:30a (Support/On-call)

**Example:**
```javascript
// Tech 1 - Early Night Tech
{
  name: 'Emmanuel Lejano',
  nickname: 'Boyet',
  dept: 'MLT',
  shift: '9:30p-6:00a',
  assignment: 'AUC Night Coverage - MiniSed QC [DAILY], GeneXpert QC [DAILY], Wipe Benches, Clean Microscopes, Log QC',
  breaks: 'Break 1: 11:30p-11:45p | Lunch: 2:00a-2:30a | Break 2: 4:30a-4:45a',
  startTime: 21.5
}

// Tech 2 - Lead Night Tech
{
  name: 'George Etape',
  nickname: 'George',
  dept: 'MLS',
  shift: '11:30p-8:00a',
  assignment: 'AUC Night Coverage - Pure 2 QC @3am [DAILY], MiniSed QC [DAILY], GeneXpert QC [DAILY], Wipe Benches, Clean Microscopes, Log QC',
  breaks: 'Break 1: 1:00a-1:15a | Lunch: 3:00a-3:30a | Break 2: 5:30a-5:45a',
  startTime: 23.5
}

// Tech 3 - Support Tech (On-call)
{
  name: 'Jacqueline Liburd',
  nickname: 'Jackie',
  dept: 'MLS',
  shift: '12:00a-6:30a',
  assignment: 'AUC Night Coverage - MiniSed QC [DAILY], GeneXpert QC [DAILY], Wipe Benches, Clean Microscopes, Log QC',
  breaks: 'Break 1: 2:00a-2:15a | Lunch: 4:00a-4:30a',
  notes: 'On-call shift',
  startTime: 0.5
}
```

**Responsibilities Distribution:**
- **Tech 1 (Boyet) - 9:30p-6:00a:**
  - MiniSed QC [DAILY]
  - GeneXpert QC [DAILY]
  - Handle evening carryover work
  - Early morning prep

- **Tech 2 (George) - 11:30p-8:00a:**
  - Pure 2 QC @3am [DAILY]
  - MiniSed QC [DAILY]
  - GeneXpert QC [DAILY]
  - All critical QC tasks
  - Lead/supervisor role

- **Tech 3 (Jackie) - 12:00a-6:30a:**
  - MiniSed QC [DAILY]
  - GeneXpert QC [DAILY]
  - Backup support
  - Overlap coverage

---

## Staffing Decision Matrix

| Condition | Model | Tech Count | Reason |
|-----------|-------|------------|--------|
| **Standard weeknight** | 2-Tech | 2 | Normal volume |
| **Monday night** | 3-Tech | 3 | Weekend backlog |
| **Post-holiday** | 3-Tech | 3 | Backlog from holiday |
| **High census day** | 3-Tech | 3 | Anticipated volume |
| **Staff training night** | 2-Tech | 2 | Reduced productivity |
| **Low volume night** | 2-Tech | 2 | Efficient staffing |

---

## Critical QC Tasks - Night Shift

### Must Be Completed Every Night:
1. **Pure 2 QC** - @3:00am
   - Assigned to: Lead tech (usually George)
   - Critical timing window

2. **MiniSed QC** - Throughout night
   - Assigned to: All night techs
   - Multiple verifications

3. **GeneXpert QC** - Throughout night
   - Assigned to: All night techs
   - Multiple verifications

### Weekly Tasks (Tuesdays):
4. **Novus QC** - After 3:00am
   - Assigned to: Lead tech (AUC location)
   - Tuesday nights only

---

## Position Requirements

### AUC Back (Day)
- **Certification:** MLS required
- **Skills:** Hematology, Chemistry, Molecular
- **Experience:** 2+ years preferred

### AUC Front (Day)
- **Certification:** MLT or MLS
- **Skills:** Specimen processing, Urinalysis
- **Experience:** 1+ years

### AUC Evening
- **Certification:** MLT or MLS
- **Skills:** Processing, Urines, Kits
- **Experience:** 1+ years
- **Staffing:** 2-3 techs based on volume

### AUC Night Coverage - Lead Tech
- **Certification:** MLS required
- **Skills:** All instruments, QC, troubleshooting
- **Experience:** 3+ years preferred
- **Shift:** 11:30p-8:00a

### AUC Night Coverage - Support Tech
- **Certification:** MLS or MLT
- **Skills:** Basic QC, instrument operation
- **Experience:** 1+ years
- **Shift:** 9:30p-6:00a or 12:00a-6:30a

---

## Scheduling Guidelines

### When Creating AUC Night Schedules:

1. **Determine Volume:**
   - Check prior week volume
   - Consider day of week (Mondays = high)
   - Review holidays/events

2. **Select Model:**
   - 2-Tech for standard nights
   - 3-Tech for high volume nights

3. **Assign Lead Tech:**
   - Always assign an experienced MLS
   - Typically: George Etape
   - Alternate: Albert Che, Francis Azih Ngene

4. **Assign Support Tech(s):**
   - On-call tech: Jackie Liburd (common)
   - Early night tech (if 3-tech): Boyet Lejano
   - Rotate to prevent burnout

5. **Distribute Tasks:**
   - Lead tech gets Pure 2 QC @3am
   - All techs share MiniSed/GeneXpert
   - Lead tech handles critical/complex tasks

---

## Common Night Coverage Patterns

### Monday-Thursday (Standard)
```
2-Tech Model:
- George (11:30p-8:00a) - Lead
- Jackie (12:00a-6:30a) - Support (On-call)
```

### Friday-Sunday (Variable)
```
Weekend Schedule - depends on volume
- Use 2-Tech or 3-Tech based on expected volume
```

### High Volume Nights
```
3-Tech Model:
- Boyet (9:30p-6:00a) - Early coverage
- George (11:30p-8:00a) - Lead
- Jackie (12:00a-6:30a) - Support (On-call)
```

---

## Quality Assurance

### Night Shift Checklist:
- [ ] All daily QC completed and logged
- [ ] Pure 2 QC @3am completed on time
- [ ] All instrument maintenance done
- [ ] All benches wiped, microscopes cleaned
- [ ] Logs completed and signed
- [ ] Handoff to day shift complete
- [ ] Any issues reported to supervisor

---

## Quick Reference

**Q:** How many techs for AUC night shift?
**A:** 2-tech model (standard) or 3-tech model (high volume)

**Q:** Who is the lead night tech?
**A:** Typically George Etape (MLS, 11:30p-8:00a)

**Q:** What's the difference between AUC Front and AUC Back?
**A:** Back = analyzers/chemistry. Front = processing/urines

**Q:** When do we use 3-tech night coverage?
**A:** Mondays, post-holidays, high volume nights

**Q:** Who does Pure 2 QC at 3am?
**A:** Always the lead night tech (11:30p-8:00a shift)

---

**Maintained By:** Laboratory Scheduling Team
**Review Frequency:** Quarterly
**Next Review:** February 2025
