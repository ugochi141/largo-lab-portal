# Kaiser Permanente Largo Laboratory Operations Portal

Production healthcare laboratory management system for Kaiser Permanente Largo Laboratory. This portal manages staff scheduling, QC/maintenance tracking, inventory management, and manager operations for clinical laboratory operations.

**Live URL**: https://ugochi141.github.io/largo-lab-portal/

## Features

### Manager Operations Suite
- **Manager Dashboard** - Daily tasks, staff contacts, training requirements, on-call coverage
- **Equipment Tracker** - Equipment inventory with serial numbers and maintenance schedules
- **Timecard Management** - PTO tracking, bereavement policy, FMLA tracking
- **Inventory Management** - Automated email ordering system with PAR level monitoring

### Staff Scheduling
- **Daily Schedule** - Interactive phlebotomy and lab staff schedules
- **QC/Maintenance Calendars** - Monthly equipment maintenance tracking
- **On-Call Reference** - On-call coverage and contact information

### Operations Management
- **Announcements Portal** - Laboratory-wide communications
- **Technical Support** - Equipment support contacts and troubleshooting
- **SBAR Implementation** - Clinical communication guidelines
- **TAT Monitoring** - Turnaround time tracking and analytics

## Technology Stack

- **Frontend**: Pure HTML/CSS/JavaScript (no build required)
- **Backend**: Optional Node.js/Express server with HIPAA compliance
- **Deployment**: GitHub Pages (static site)
- **Process Management**: PM2 for production server

## Local Development

```bash
# Start local server
python3 start-server.py
# Opens http://localhost:8080

# Or use Python's built-in server
python3 -m http.server 8000
# Opens http://localhost:8000
```

## Deployment

The site automatically deploys to GitHub Pages when you push to the main branch:

```bash
git add .
git commit -m "Your changes"
git push
```

Wait 2-3 minutes for GitHub Pages to build and deploy.

## Project Structure

```
/
├── index.html                     - Main portal homepage
├── Schedules/                     - All scheduling interfaces
│   ├── Daily Schedule.html        - Main schedule (52K+ lines)
│   └── QC_Maintenance_*.html      - Monthly QC/maintenance calendars
├── manager-dashboard.html         - Manager operations center
├── equipment-tracker.html         - Equipment inventory
├── inventory.html                 - Inventory management
├── assets/                        - Images, icons, fonts
├── css/                          - Stylesheets
├── js/                           - JavaScript files
├── LabAutomation/                - Automation scripts
├── SOP_2025/                     - Standard Operating Procedures
├── server/                       - Optional Node.js backend
└── data/                         - Data files

```

## Healthcare Compliance

This is a **HIPAA-compliant** healthcare system:
- No PHI (patient health information) in code or logs
- Comprehensive audit logging with timestamps
- CLIA and CAP laboratory standards compliance
- Critical value acknowledgment within 15 minutes

## System Integration

The portal integrates with:
- **Epic Beaker** - Lab Information System
- **Qmatic** - Queue Management System
- **Bio-Rad Unity** - QC Management
- **HRConnect** - HR/Scheduling System
- **Smart Square** - Staff scheduling

## License

Private repository for Kaiser Permanente Largo Laboratory internal use only.

## Contact

Kaiser Permanente Largo Laboratory
Maryland, United States
