# SharePoint Deployment Guide for Largo Lab Team Portal

## Overview
The SharePoint Team Portal is a streamlined version of the Largo Laboratory Portal designed for team collaboration without manager-specific features.

## Files to Deploy

### Main Portal Files
1. **sharepoint-team-portal.html** - Main SharePoint team portal (no manager features)
2. **index.html** - Reorganized main portal with better navigation
3. **index-original-backup.html** - Backup of original portal

### Required Support Files
- `SOPs/downtime-procedures.html` - Critical downtime procedures
- `on-call-reference.html` - On-call quick reference guide
- `equipment-tracker.html` - Equipment status tracker
- `Schedules/` - All schedule HTML files
- `KP_SOP/` - Standard operating procedures

## SharePoint Deployment Steps

### 1. Prepare Files for SharePoint

```bash
# Create SharePoint deployment folder
mkdir sharepoint-deploy
cp sharepoint-team-portal.html sharepoint-deploy/
cp -r SOPs sharepoint-deploy/
cp on-call-reference.html sharepoint-deploy/
cp equipment-tracker.html sharepoint-deploy/
cp -r Schedules sharepoint-deploy/
cp -r KP_SOP sharepoint-deploy/
```

### 2. Upload to SharePoint

1. **Navigate to your SharePoint site**
   - Go to your team's SharePoint site
   - Click "Documents" or "Site Contents"

2. **Create a new folder**
   - Name it "Laboratory Portal" or similar
   - Upload the contents of `sharepoint-deploy/`

3. **Set the homepage**
   - Upload `sharepoint-team-portal.html`
   - Set as the default page for the folder

### 3. Configure Permissions

#### Recommended Permission Groups:

**All Staff (Read Access)**
- View schedules
- Access SOPs
- View equipment status
- Access on-call reference

**Lab Leads (Contribute Access)**
- Update schedules
- Edit equipment status
- Modify SOPs (with approval)

**Managers (Full Control)**
- Access to separate manager portal
- Full edit capabilities
- User management

### 4. SharePoint Web Part Integration

You can also add the portal as a web part:

1. Edit your SharePoint page
2. Add an "Embed" web part
3. Paste the following code:

```html
<iframe
  src="[YOUR-SHAREPOINT-URL]/Laboratory Portal/sharepoint-team-portal.html"
  width="100%"
  height="800px"
  frameborder="0">
</iframe>
```

## Features Available in Team Portal

### ✅ Included Features
- **Emergency Contacts** - Quick access to IT support and command center
- **Downtime Procedures** - Critical emergency protocols
- **Staff Schedules** - View daily assignments and coverage
- **Equipment Status** - Check maintenance and support contacts
- **SOPs Access** - All standard operating procedures
- **Training Resources** - Links to KP Learn and compliance
- **On-Call Reference** - Printable quick reference guide

### ❌ Excluded Manager Features
- Manager Dashboard
- Inventory Management System
- Timecard Management
- Administrative controls
- Budget and financial tools
- Performance metrics

## Quick Links Setup

### Internal SharePoint Links
Update these links in `sharepoint-team-portal.html` to match your SharePoint structure:

```html
<!-- Replace with your SharePoint URLs -->
<a href="/sites/LargoLab/Schedules/Daily%20Schedule.html">Daily Schedule</a>
<a href="/sites/LargoLab/SOPs/downtime-procedures.html">Downtime Procedures</a>
```

### External Kaiser Systems
These links should work as-is:
- HR Connect: https://hrconnect.kp.org
- KP Learn: https://kplearn.kp.org
- TempTrak: https://temptrak.kp.org
- Service Now: https://servicenow.kp.org

## Maintenance

### Updating Schedules
1. Use the main portal's Schedule Manager
2. Export updated schedule files
3. Upload to SharePoint Schedules folder

### Updating SOPs
1. Edit SOPs in the main portal
2. Export as HTML
3. Replace files in SharePoint

### Regular Updates
- **Daily**: Check schedule links
- **Weekly**: Verify equipment status
- **Monthly**: Review and update SOPs
- **Quarterly**: Full portal review

## Troubleshooting

### Common Issues

**Links not working**
- Check relative paths
- Ensure all files are uploaded
- Verify SharePoint permissions

**Formatting issues**
- SharePoint may override some CSS
- Use inline styles if needed
- Test in different browsers

**Access problems**
- Verify user permissions
- Check SharePoint group membership
- Contact IT support: 301-456-6096

## Support Contacts

- **IT Support**: 301-456-6096
- **SharePoint Admin**: [Your SharePoint admin]
- **Lab Manager**: [Manager contact]
- **Command Center**: 866-248-0661

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 30, 2025 | Initial SharePoint team portal |
| 2.1.0 | Oct 30, 2025 | Main portal with full features |

## Notes

- The SharePoint version is designed to be lightweight and fast
- Manager features are available in the separate main portal
- All critical emergency information is included
- Portal is mobile-responsive for access on any device

---

**Last Updated**: October 30, 2025
**Portal Version**: SharePoint Team Portal v1.0
**Main Portal Version**: v2.1.0