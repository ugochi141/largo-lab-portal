
@sessions/CLAUDE.sessions.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kaiser Permanente Largo Laboratory Operations Portal - A dual-mode healthcare laboratory management system with both a static HTML frontend (GitHub Pages) and a Node.js backend (production server). The portal manages staff scheduling, QC/maintenance tracking, inventory management, and manager operations for a clinical laboratory.

**Live URL**: https://ugochi141.github.io/largo-lab-portal/

## Architecture

### Dual Deployment Model

This project operates in **two distinct modes**:

1. **Static HTML Mode** (GitHub Pages - Primary deployment)
   - Pure client-side HTML/CSS/JavaScript
   - No build process required
   - Deployed automatically on push to main branch
   - Uses localStorage for data persistence
   - All schedule data hardcoded in HTML files

2. **Node.js Server Mode** (Production backend - Optional)
   - Express.js server with HIPAA compliance
   - PM2 process management
   - Health monitoring endpoints
   - Critical value management
   - Requires Node.js 18+ to run

**IMPORTANT**: When editing schedules, you are working with the **Static HTML Mode**. Changes to `Schedules/Daily Schedule.html` are immediately live on GitHub Pages after commit/push.

### Key System Components

**Staff Scheduling System** (`Schedules/Daily Schedule.html`)
- 52,000+ line monolithic HTML file containing all schedule data
- Schedule data stored as JavaScript object `scheduleData` within the HTML
- Format: `'YYYY-MM-DD': { phleb: [...], lab: [...] }`
- Uses localStorage to cache uploaded schedules from Schedule Manager
- **Priority order**: Uploaded data in localStorage > Hardcoded scheduleData
- Each staff entry requires: `name`, `nickname`, `dept`, `shift`, `assignment`, `breaks`, `startTime`

**QC & Maintenance Calendars** (`Schedules/QC_Maintenance_*.html`)
- Monthly interactive calendars for October, November, December 2025
- Tracks weekly, biweekly, and monthly equipment maintenance
- Task scheduling embedded in JavaScript `tasks` object with specific days array
- Format: `{ weekly: {}, biweekly: {}, monthly: {} }` with equipment configs
- Index page: `Schedules/qc-maintenance.html`

**Manager Operations Suite**
- `manager-dashboard.html` - Daily tasks, contacts, quick links
- `equipment-tracker.html` - Equipment inventory with serial numbers
- `timecard-management.html` - PTO tracking, bereavement policy
- `inventory.html` - Automated email ordering system

## Development Commands

### Static HTML Development (Primary)
```bash
# Local testing
python3 start-server.py
# Opens http://localhost:8080

# Or use Python's built-in server
python3 -m http.server 8000
# Opens http://localhost:8000
```

### Node.js Backend (Optional)
```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production mode with PM2
npm run pm2:start
pm2 status
pm2 logs largo-lab-portal

# Testing
npm test
npm run test:coverage

# Code quality
npm run lint
npm run lint:fix
npm run format
npm run type-check

# Build (for React version)
npm run build
npm run preview
```

### Deployment
```bash
# Deploy to GitHub Pages (happens automatically on push)
git add .
git commit -m "Your message"
git push

# Manual deploy (if needed)
npm run deploy

# Check PM2 status (if using Node backend)
pm2 status
pm2 monit
```

## Critical Schedule Management Rules

### Staff Nickname Requirements
**ALWAYS use the correct nickname - this is non-negotiable:**
- Johnette Brooks → `'Netta'` (NOT 'Johnette')
- Emmanuella Theodore → `'Emma'` (NOT 'Emmanuella')
- Jacqueline Liburd → `'Jackie'` (NOT 'Jacqueline')
- Ogheneochuko Eshofa → `'Tracy'` (NOT 'Ogheneochuko')
- Emmanuel Lejano → `'Boyet'` (NOT 'Emmanuel')

### Department Code Requirements
- Medical Laboratory Scientists → `'MLS'` (NEVER use 'MT')
- Medical Laboratory Technicians → `'MLT'`
- Medical Laboratory Assistants → `'MLA'`
- Phlebotomists → No dept field (they go in phleb array)

### Fixed Break Times
**Netta (Johnette Brooks) has FIXED breaks that NEVER change:**
```javascript
breaks: 'Break 1: 9:00a-9:15a | Lunch: 11:00a-11:30a | Break 2: 1:00p-1:15p'
```

### Schedule Data Structure
```javascript
'YYYY-MM-DD': {
    phleb: [
        {
            name: 'Full Name',
            nickname: 'Nickname',
            assignment: 'Draw Patients' | 'Processor' | 'Draw Patients/Opener' | 'Draw Patients/Closer' | 'Draw Patients (Backup Processor)',
            shift: '7:00a-3:30p',
            breaks: 'Break 1: 9:00a-9:15a | Lunch: 11:00a-11:30a | Break 2: 1:00p-1:15p',
            startTime: 7,
            notes: 'Optional notes' // Only if needed
        }
    ],
    lab: [
        {
            name: 'Full Name',
            nickname: 'Nickname',
            dept: 'MLS' | 'MLT' | 'MLA',
            shift: '7:30a-4:00p',
            assignment: 'Detailed role and QC tasks',
            breaks: 'Break 1: 9:30a-9:45a | Lunch: 12:00p-12:30p | Break 2: 2:30p-2:45p',
            startTime: 7.5
        }
    ]
}
```

### Assignment Format Rules
- Processing-trained phlebotomists: Use `'Processor'` (not "Draw Patients/Processor")
- Backup processors: Use `'Draw Patients (Backup Processor)'`
- Non-processing-trained: Use `'Draw Patients'` only
- Openers: `'Draw Patients/Opener'`
- Closers: `'Draw Patients/Closer'`
- Hot Seat: `'Draw Patients/Hot Seat'`

### On-Call Shifts
Create **separate entries** for on-call hours:
```javascript
// On-call entry (6:00a-8:00a)
{
    name: 'Farah Moise',
    nickname: 'Farah',
    assignment: 'Draw Patients/Opener',
    shift: '6:00a-8:00a',
    breaks: 'None',
    notes: 'On-call hours only',
    startTime: 6
},
// Regular shift entry (8:00a-4:30p)
{
    name: 'Farah Moise',
    nickname: 'Farah',
    assignment: 'Draw Patients/Runner',
    shift: '8:00a-4:30p',
    breaks: 'Break 1: 9:45a-10:00a | Lunch: 12:30p-1:00p | Break 2: 1:45p-2:00p',
    startTime: 8
}
```

### MLA Restrictions
Medical Laboratory Assistants (MLA) can ONLY perform:
- Assist with QC/Maint
- Inventory
- SQA Daily [DAILY]
- Urines
- Kits QC

Always include "MLA Restriction" note in assignment.

## QC/Maintenance Schedule Format

### Weekly Tasks
Tasks that occur every week on specific days:
```javascript
weekly: {
    hematek: {
        name: 'Hematek',
        location: 'Both',
        shift: 'day',
        days: [1,8,15,22,29] // Saturdays in November
    },
    sysmexAUC: {
        name: 'Sysmex Shutdown',
        location: 'AUC',
        shift: 'evening',
        time: '9pm',
        days: [1,8,15,22,29] // Every Saturday
    }
}
```

### Biweekly Tasks
Tasks that occur every other week:
```javascript
biweekly: {
    pure2: {
        name: 'Pure 2',
        location: 'AUC',
        shift: 'night',
        time: '3am',
        days: [8,22] // 2nd and 4th Saturday
    }
}
```

### Monthly Tasks
Tasks that occur once per month on specific weeks:
```javascript
monthly: {
    hematekMonthly: {
        name: 'Hematek Monthly',
        location: 'Both',
        shift: 'day',
        days: [12] // 2nd Wednesday
    }
}
```

### Calendar First Day Configuration
When creating new monthly calendars:
- October 2025 starts Wednesday (firstDay: 3)
- November 2025 starts Saturday (firstDay: 6)
- December 2025 starts Monday (firstDay: 1)

## localStorage vs Hardcoded Data

The Daily Schedule prioritizes data in this order:
1. **Uploaded schedule data** from localStorage key `'dailyScheduleData'`
2. **Hardcoded schedule data** in the `scheduleData` JavaScript object

When you edit schedule data in `Schedules/Daily Schedule.html`, you're updating the hardcoded fallback. If users see wrong data after your changes, they need to clear localStorage:

```javascript
// User must run in browser console:
localStorage.clear();
location.reload();
```

Or click the "Clear All" button on the Daily Schedule page.

## File Editing Guidelines

### When Editing Schedules
1. **ALWAYS** use the `Read` tool first before `Edit` or `Write`
2. Verify correct nicknames before committing
3. Verify all MLS staff (not MT)
4. Verify Netta's fixed break times
5. Order all entries by `startTime` (ascending)
6. Separate on-call shifts into their own entries
7. Check assignment format matches training status

### When Editing QC Calendars
1. Calculate correct `firstDay` for the month (0=Sunday, 6=Saturday)
2. Update `days` arrays with actual dates (not day-of-week)
3. Verify weekly tasks occur every week
4. Verify biweekly tasks alternate weeks
5. Verify monthly tasks on correct week of month

### Git Commit Format
```bash
git commit -m "$(cat <<'EOF'
Brief summary of changes

DETAILED CHANGES:
- Specific change 1
- Specific change 2
- Specific change 3

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Always use heredoc format for multi-line commits to avoid parsing issues.

## Healthcare Compliance Requirements

This is a **HIPAA-compliant** healthcare system. When working with code:
- Never log PHI (patient health information)
- All audit logs must include timestamps and user IDs
- Critical values must be acknowledged within 15 minutes
- Follow CLIA and CAP laboratory standards
- Maintain comprehensive error handling for patient safety

## System Integration Points

The portal integrates with:
- **Epic Beaker** - Lab Information System
- **Qmatic** - Queue Management System
- **Bio-Rad Unity** - QC Management
- **HRConnect** - HR/Scheduling System
- **Smart Square** - Staff scheduling export source

## Testing Locally

After making changes to schedules:
1. Start local server: `python3 start-server.py`
2. Open browser to `http://localhost:8080`
3. Navigate to the changed page
4. Use browser DevTools Console to check for JavaScript errors
5. If seeing old data, run `localStorage.clear()` in console
6. Verify correct names, departments, and break times appear

## Common Issues

**Issue**: Schedule shows wrong staff after editing
**Solution**: User needs to clear localStorage cache or click "Clear All" button

**Issue**: Git commit fails with multi-line message
**Solution**: Use heredoc format with `$(cat <<'EOF'...EOF)` syntax

**Issue**: QC tasks appearing on wrong days
**Solution**: Verify `days` array contains actual dates (1-31), not day-of-week numbers

**Issue**: GitHub Pages showing 404 for schedules
**Solution**: Check directory name case-sensitivity (GitHub Pages is case-sensitive: `Schedules/` not `schedules/`)

**Issue**: Edit tool fails with "File has not been read yet"
**Solution**: Always use `Read` tool before `Edit` or `Write` tools

## Production Deployment Checklist

When deploying major changes:
- [ ] Test locally with `python3 start-server.py`
- [ ] Verify all links work (especially case-sensitive paths)
- [ ] Check JavaScript console for errors
- [ ] Verify schedule data displays correctly
- [ ] Test localStorage clear functionality
- [ ] Commit with detailed message
- [ ] Push to main branch
- [ ] Verify GitHub Pages deployment (wait 2-3 minutes)
- [ ] Test live site at https://ugochi141.github.io/largo-lab-portal/
- [ ] Clear browser cache and retest

## Repository Structure Context

```
/Schedules/              - All scheduling interfaces
  Daily Schedule.html    - Main schedule (52K+ lines with embedded data)
  QC_Maintenance_*.html  - Monthly QC/maintenance calendars
  qc-maintenance.html    - QC calendar index page

/assets/css/             - Styling (KP brand colors)
/server/                 - Optional Node.js backend
/LabAutomation/          - Automation scripts and workflows
/SOP_2025/               - Standard Operating Procedures

*.js files (root)        - Schedule data files for reference
                          (NOT used by Daily Schedule.html directly)
```

The JavaScript files like `schedule_11_03_2025.js` are **reference files only** - they document the schedule structure but are NOT imported by the HTML files. All schedule data must be added directly to the `scheduleData` object inside `Schedules/Daily Schedule.html`.
