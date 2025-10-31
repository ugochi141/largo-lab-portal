# Largo Lab Portal v3.0 - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (2 minutes)

```bash
cd /Users/ugochindubuisi1/github-repos/largo-lab-portal
npm install
```

This installs all required packages including React, TypeScript, Tailwind CSS, and more.

### Step 2: Start Development Server (1 minute)

```bash
npm run dev
```

Open your browser to: **http://localhost:3000/largo-lab-portal**

### Step 3: Explore the Portal (2 minutes)

1. **Home Page** - Overview of features
2. **Schedule** - Interactive schedule manager
3. **Dashboard** - Manager tools (coming soon)
4. **Safety** - Compliance tracking (coming soon)

## 📅 Create Your First Schedule

### 1. Navigate to Schedule

Click "Schedule" in the navigation bar or visit:
`http://localhost:3000/largo-lab-portal/schedule`

### 2. Select Date

Use the date picker or Previous/Next buttons to select a date.

### 3. Drag Staff to Time Slots

**Available Staff (Left Sidebar):**
- Drag any staff member
- Drop onto a time slot (6 AM - 8 PM)
- Staff automatically assigned

**Example:**
```
Drag: "John Doe - Lead Phlebotomist"
Drop: 8:00 AM - 9:00 AM time slot
Result: John scheduled for 8-9 AM
```

### 4. Edit Entry Details

Click the **edit icon** (pencil) on any schedule entry to add:
- Station assignment (e.g., "Station A", "Room 101")
- Notes (e.g., "Training new staff")

### 5. Handle Conflicts

If you see colored alerts:
- 🔴 **Red (Error)**: Must fix - double-booking, invalid assignment
- 🟠 **Orange (Warning)**: Review - overtime, missing break
- 🔵 **Blue (Info)**: For awareness - certifications expiring

### 6. Export Schedule

Click **"Export Schedule"** button and choose:
- **PDF**: Professional report with branding
- **Excel**: Spreadsheet for analysis
- **CSV**: Universal format

## 🎨 Understanding the Interface

### Color Coding

**Phlebotomy Roles (Staff Cards):**
- 🟣 Purple: Lead Phlebotomist
- 🔵 Blue: Senior Phlebotomist
- 🟢 Green: Phlebotomist
- 🟡 Yellow: Phlebotomy Technician
- 🟠 Orange: Float Phlebotomist

**Status Indicators:**
- ✅ Active assignment
- 🛑 Break time
- ⚠️ Conflict detected

### Time Slots

- **Range**: 6:00 AM to 8:00 PM (14 slots)
- **Duration**: 1 hour per slot
- **Capacity**: Multiple staff per slot
- **Drag Zone**: Highlighted on hover

## 🔄 Common Workflows

### Workflow 1: Weekly Schedule

```
1. Select Monday date
2. Assign all staff for the day
3. Export to PDF
4. Navigate to Tuesday (Next button)
5. Repeat for Tuesday-Friday
6. Collect all PDFs for weekly review
```

### Workflow 2: Emergency Staffing Change

```
1. Navigate to today's schedule
2. Remove unavailable staff (delete icon)
3. Drag replacement staff to open slots
4. Check for conflicts
5. Export updated schedule
```

### Workflow 3: Break Scheduling

```
1. Create morning shift assignments
2. Add break entries (marked as "Break")
3. System checks for break compliance
4. Warnings if breaks missing after 4+ hours
```

## 🛠️ Development Commands

### Essential Commands

| Command | What It Does |
|---------|--------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run test suite |
| `npm run lint` | Check code quality |

### Build for Production

```bash
npm run build
```

Creates optimized files in `dist/` folder.

### Deploy to GitHub Pages

```bash
npm run deploy
```

Builds and deploys to: https://ugochi141.github.io/largo-lab-portal/

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Option 1: Kill process
npx kill-port 3000

# Option 2: Use different port
npm run dev -- --port 3001
```

### Module Not Found

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Check TypeScript
npm run type-check

# Check linting
npm run lint
```

### Blank Page After Build

Check browser console for errors. Ensure `base: '/largo-lab-portal/'` in `vite.config.ts` matches your deployment path.

## 📚 Learning Resources

### Explore the Code

**Key Files to Understand:**
1. `src/App.tsx` - Main application
2. `src/components/schedule/InteractiveScheduleManager.tsx` - Schedule UI
3. `src/store/scheduleStore.ts` - State management
4. `src/utils/validation.ts` - Conflict detection
5. `src/utils/export.ts` - Export functions

### Documentation

- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **Full README**: `README-REACT-V3.md`
- **Production Summary**: `PRODUCTION_SUMMARY.md`

### TypeScript Types

See `src/types/index.ts` for complete type definitions:
- Staff
- ScheduleEntry
- PhlebotomyRole
- ScheduleConflict
- And more...

## ✅ Quick Checklist

Before deploying to production:

- [ ] Run `npm test` - All tests pass
- [ ] Run `npm run lint` - No linting errors
- [ ] Run `npm run type-check` - No TypeScript errors
- [ ] Run `npm run build` - Build succeeds
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile device
- [ ] Verify all navigation links work
- [ ] Test schedule creation workflow
- [ ] Test export to PDF/Excel/CSV
- [ ] Check accessibility with screen reader
- [ ] Review conflicts are detected correctly

## 🎯 Next Steps

### For Developers

1. **Explore Components**
   - Review `src/components/schedule/` folder
   - Understand state management in `src/store/`
   - Study utility functions in `src/utils/`

2. **Add Tests**
   - Create test files in `__tests__/` folders
   - Target 90% coverage
   - Run `npm test -- --coverage`

3. **Implement Phase 2**
   - Manager Dashboard components
   - Meeting scheduler
   - Action item tracker

### For Users

1. **Create Sample Schedules**
   - Test with different role combinations
   - Try conflict scenarios
   - Export and review outputs

2. **Provide Feedback**
   - Note any usability issues
   - Suggest improvements
   - Report bugs

3. **Plan Adoption**
   - Train staff on new interface
   - Migrate existing schedules
   - Establish workflows

## 📞 Get Help

### Resources

- **Documentation**: Read IMPLEMENTATION_GUIDE.md
- **Types**: Check src/types/index.ts
- **Examples**: Review src/components/schedule/

### Support

- **Technical Issues**: Contact development team
- **Feature Requests**: Submit GitHub issue
- **General Questions**: See documentation

## 🎉 Success!

You're now ready to use the Largo Lab Portal v3.0!

**Key Features:**
- ✅ Interactive drag-and-drop scheduling
- ✅ Real-time conflict detection
- ✅ Professional PDF/Excel exports
- ✅ Mobile-responsive design
- ✅ Accessibility compliant

**Start Creating Schedules:** http://localhost:3000/largo-lab-portal/schedule

---

**Need more help?** See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for detailed documentation.

**Version:** 3.0.0 | **Last Updated:** January 2025
