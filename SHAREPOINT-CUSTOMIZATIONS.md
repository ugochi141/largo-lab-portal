# SharePoint Customizations Guide
## Largo Laboratory Portal - SharePoint Adaptations

This document details the specific customizations needed for SharePoint deployment.

---

## Table of Contents

1. [Data Storage Migration](#data-storage-migration)
2. [SharePoint List Schemas](#sharepoint-list-schemas)
3. [REST API Examples](#rest-api-examples)
4. [Web Parts Configuration](#web-parts-configuration)
5. [Workflow Automation](#workflow-automation)
6. [Custom Solutions](#custom-solutions)

---

## Data Storage Migration

### From localStorage to SharePoint Lists

**Current Implementation:**
- Uses browser localStorage for schedule data
- Uses JSON files on server for equipment/inventory

**SharePoint Approach:**
- Use SharePoint Lists for structured data
- Use Document Libraries for file storage
- Use SharePoint Search for queries

---

## SharePoint List Schemas

### 1. Schedule Data List

**List Name:** `ScheduleData`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single line of text | Yes | Date (YYYY-MM-DD) |
| ScheduleDate | Date and Time | Yes | Actual date object |
| ScheduleJSON | Multiple lines of text | Yes | Full schedule as JSON |
| PhlebStaffCount | Number | No | Number of phleb staff |
| LabStaffCount | Number | No | Number of lab staff |
| LastModified | Date and Time | Auto | Last update timestamp |
| ModifiedBy | Person or Group | Auto | Who modified |

**PowerShell to Create:**
```powershell
Connect-PnPOnline -Url "https://sp-cloud.kp.org/sites/LargoLabTeamPortal"

Add-PnPList -Title "ScheduleData" -Template GenericList

Add-PnPField -List "ScheduleData" -DisplayName "ScheduleDate" -InternalName "ScheduleDate" -Type DateTime -Required
Add-PnPField -List "ScheduleData" -DisplayName "ScheduleJSON" -InternalName "ScheduleJSON" -Type Note
Add-PnPField -List "ScheduleData" -DisplayName "PhlebStaffCount" -InternalName "PhlebStaffCount" -Type Number
Add-PnPField -List "ScheduleData" -DisplayName "LabStaffCount" -InternalName "LabStaffCount" -Type Number
```

### 2. Equipment Inventory List

**List Name:** `EquipmentInventory`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single line of text | Yes | Equipment Name |
| SerialNumber | Single line of text | Yes | Serial number |
| Location | Choice | Yes | AUC, MOB, Both |
| Type | Choice | Yes | Analyzer, Centrifuge, etc |
| Manufacturer | Single line of text | No | Manufacturer name |
| Model | Single line of text | No | Model number |
| PurchaseDate | Date and Time | No | When purchased |
| MaintenanceSchedule | Choice | No | Daily, Weekly, Monthly |
| LastMaintenance | Date and Time | No | Last serviced date |
| NextMaintenance | Date and Time | No | Next service due |
| SupportPhone | Single line of text | No | Support contact |
| Notes | Multiple lines of text | No | Additional notes |

### 3. Inventory Items List

**List Name:** `InventoryItems`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single line of text | Yes | Item name |
| Category | Choice | Yes | Needles, Tubes, etc |
| ParLevel | Number | Yes | Minimum quantity |
| CurrentStock | Number | Yes | Current quantity |
| Unit | Choice | Yes | Box, Each, Case |
| Supplier | Lookup | No | From Suppliers list |
| LastOrdered | Date and Time | No | Last order date |
| AutoReorder | Yes/No | Yes | Auto-order enabled |
| ReorderEmail | Single line of text | No | Email for orders |

### 4. Call Outs List

**List Name:** `CallOuts`

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| Title | Single line of text | Yes | Staff name |
| CallOutDate | Date and Time | Yes | Date of call out |
| Shift | Choice | Yes | Day, Evening, Night |
| Reason | Choice | Yes | Sick, PTO, etc |
| Replacement | Person or Group | No | Who covered |
| Notes | Multiple lines of text | No | Additional details |

---

## REST API Examples

### 1. Create Schedule Entry

```javascript
async function createSchedule(dateStr, scheduleData) {
    const response = await fetch(
        `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('ScheduleData')/items`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
            },
            body: JSON.stringify({
                __metadata: {
                    type: 'SP.Data.ScheduleDataListItem'
                },
                Title: dateStr,
                ScheduleDate: new Date(dateStr).toISOString(),
                ScheduleJSON: JSON.stringify(scheduleData),
                PhlebStaffCount: scheduleData.phleb.length,
                LabStaffCount: scheduleData.lab.length
            })
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}
```

### 2. Read Schedule for Date

```javascript
async function getScheduleForDate(dateStr) {
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('ScheduleData')/items` +
                `?$filter=Title eq '${dateStr}'` +
                `&$select=Title,ScheduleJSON,ScheduleDate,PhlebStaffCount,LabStaffCount`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json;odata=verbose'
        }
    });

    const data = await response.json();

    if (data.d.results.length > 0) {
        const item = data.d.results[0];
        return {
            date: item.ScheduleDate,
            schedule: JSON.parse(item.ScheduleJSON),
            phlebCount: item.PhlebStaffCount,
            labCount: item.LabStaffCount
        };
    }

    return null;
}
```

### 3. Update Schedule

```javascript
async function updateSchedule(itemId, scheduleData) {
    const response = await fetch(
        `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('ScheduleData')/items(${itemId})`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
                'IF-MATCH': '*',
                'X-HTTP-Method': 'MERGE'
            },
            body: JSON.stringify({
                __metadata: {
                    type: 'SP.Data.ScheduleDataListItem'
                },
                ScheduleJSON: JSON.stringify(scheduleData),
                PhlebStaffCount: scheduleData.phleb.length,
                LabStaffCount: scheduleData.lab.length
            })
        }
    );

    return response.ok;
}
```

### 4. Get Equipment List

```javascript
async function getEquipment() {
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('EquipmentInventory')/items` +
                `?$select=Title,SerialNumber,Location,Type,MaintenanceSchedule,NextMaintenance,SupportPhone` +
                `&$orderby=Location,Title`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json;odata=verbose'
        }
    });

    const data = await response.json();
    return data.d.results;
}
```

### 5. Check Inventory Levels

```javascript
async function getItemsBelowPar() {
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('InventoryItems')/items` +
                `?$select=Title,Category,ParLevel,CurrentStock,Unit,ReorderEmail` +
                `&$filter=CurrentStock lt ParLevel and AutoReorder eq 1`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json;odata=verbose'
        }
    });

    const data = await response.json();
    return data.d.results;
}
```

---

## Web Parts Configuration

### 1. Daily Schedule Web Part

**Setup:**
1. Create new Site Page: `DailySchedule.aspx`
2. Add **Script Editor** Web Part
3. Insert adapted Daily Schedule.html content
4. Configure web part:
   - Chrome Type: None
   - Height: 800px
   - Width: 100%

**Code Modifications:**
```html
<script src="/_layouts/15/sp.runtime.js"></script>
<script src="/_layouts/15/sp.js"></script>
<script>
// Wait for SP to load
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() {
    console.log('SharePoint loaded');
    initSchedule();
});

function initSchedule() {
    // Replace localStorage calls with SharePoint REST API
    // Load schedule from SharePoint List
    loadScheduleFromSharePoint();
}
</script>
```

### 2. Manager Dashboard Web Part

**Modern Page Layout:**
```
[Header Section - Full Width]
  - Welcome message
  - Date/time
  - Quick stats

[Three Column Section]
  [Column 1: Daily Tasks]
  [Column 2: Staff Contacts]
  [Column 3: Quick Links]

[Full Width Section]
  - Equipment Support
  - On-Call Coverage
```

**Web Parts Used:**
- Text Web Part (for static content)
- List Web Part (for dynamic lists)
- Quick Links Web Part (for navigation)

### 3. Equipment Tracker Web Part

**Use List View Web Part:**
1. Add Equipment Inventory List Web Part
2. Configure View:
   - Group by: Location
   - Sort by: Type, Title
   - Columns: All except ID
3. Add custom formatting with JSON:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/row-formatting.schema.json",
  "additionalRowClass": "=if([$NextMaintenance] < @now, 'sp-field-severity--severeWarning', '')"
}
```

---

## Workflow Automation

### 1. Inventory Auto-Ordering Workflow

**Power Automate Flow:**

```
Trigger: Schedule - Run Daily at 7:00 AM

Actions:
1. Get Items from InventoryItems where:
   - CurrentStock < ParLevel
   - AutoReorder = Yes

2. For each item:
   - Compose email body with item details
   - Send email to ReorderEmail address
   - Update LastOrdered field
   - Log to audit list

3. Send summary email to inventory manager
```

### 2. Maintenance Reminder Workflow

**Power Automate Flow:**

```
Trigger: Schedule - Run Daily at 6:00 AM

Actions:
1. Get Equipment where NextMaintenance is:
   - Today
   - Within next 3 days

2. For each equipment:
   - Send email to maintenance team
   - Create task in Planner
   - Update NextMaintenance field

3. Send daily summary to manager
```

### 3. Schedule Change Notification

**Power Automate Flow:**

```
Trigger: When an item is modified in ScheduleData

Actions:
1. Get modified item details
2. Parse ScheduleJSON to find changes
3. Send email to affected staff members
4. Post to Teams channel (if configured)
5. Log change to audit list
```

---

## Custom Solutions

### 1. SharePoint Framework (SPFx) Extension

For advanced customization, create SPFx web part:

```typescript
// src/webparts/dailySchedule/DailyScheduleWebPart.ts
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

export default class DailyScheduleWebPart extends BaseClientSideWebPart<IDailyScheduleWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `
      <div class="largo-schedule">
        <h2>Daily Staff Schedule</h2>
        <div id="scheduleContainer"></div>
      </div>
    `;

    this.loadScheduleData();
  }

  private async loadScheduleData(): Promise<void> {
    // Use sp-pnp-js for easier SharePoint interactions
    const items = await sp.web.lists
      .getByTitle('ScheduleData')
      .items
      .select('Title', 'ScheduleJSON')
      .get();

    this.renderSchedule(items);
  }
}
```

### 2. Custom Forms with Power Apps

**Create Power App for Schedule Management:**

1. **Data Source:** Connect to ScheduleData list
2. **Screens:**
   - Browse screen (gallery of dates)
   - Detail screen (full schedule view)
   - Edit screen (modify schedule)
3. **Features:**
   - Drag-and-drop staff assignment
   - Conflict detection
   - Validation rules
4. **Embed in SharePoint:**
   - Add Power Apps Web Part
   - Select your app
   - Configure parameters

---

## Security Considerations

### 1. Item-Level Permissions

**Restrict access to specific items:**

```javascript
// Grant edit access only to managers
async function setSchedulePermissions(itemId) {
    const item = web.lists.getByTitle('ScheduleData').items.getById(itemId);

    // Break inheritance
    await item.breakRoleInheritance(false);

    // Grant manager group full control
    await item.roleAssignments.add(
        _spPageContextInfo.groupId_managers,
        SP.RoleDefinitionBindingCollection.newObject(context)
    );
}
```

### 2. Audit Logging

**Enable versioning and audit:**

```javascript
// Enable list versioning
await sp.web.lists.getByTitle('ScheduleData').update({
    EnableVersioning: true,
    MajorVersionLimit: 50
});

// Custom audit log
async function logAudit(action, details) {
    await sp.web.lists.getByTitle('AuditLog').items.add({
        Title: action,
        UserName: _spPageContextInfo.userDisplayName,
        Details: JSON.stringify(details),
        Timestamp: new Date().toISOString()
    });
}
```

---

## Performance Optimization

### 1. Caching Strategy

```javascript
// Cache SharePoint data in session storage
class SharePointCache {
    constructor(ttl = 300000) { // 5 minutes default
        this.ttl = ttl;
    }

    set(key, value) {
        const item = {
            value: value,
            expiry: Date.now() + this.ttl
        };
        sessionStorage.setItem(key, JSON.stringify(item));
    }

    get(key) {
        const itemStr = sessionStorage.getItem(key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        if (Date.now() > item.expiry) {
            sessionStorage.removeItem(key);
            return null;
        }

        return item.value;
    }
}

// Usage
const cache = new SharePointCache();

async function getScheduleWithCache(date) {
    const cacheKey = `schedule_${date}`;
    let data = cache.get(cacheKey);

    if (!data) {
        data = await getScheduleForDate(date);
        cache.set(cacheKey, data);
    }

    return data;
}
```

### 2. Batch Requests

```javascript
// Batch multiple requests
async function batchLoadData() {
    const batch = sp.web.createBatch();

    const schedules = sp.web.lists.getByTitle('ScheduleData')
        .items.inBatch(batch).get();

    const equipment = sp.web.lists.getByTitle('EquipmentInventory')
        .items.inBatch(batch).get();

    await batch.execute();

    return {
        schedules: await schedules,
        equipment: await equipment
    };
}
```

---

## Deployment Checklist

- [ ] All SharePoint Lists created with correct schemas
- [ ] Web Parts configured and tested
- [ ] REST API calls updated from localStorage
- [ ] Power Automate workflows deployed
- [ ] Permissions configured correctly
- [ ] Navigation updated
- [ ] Testing completed
- [ ] Documentation updated
- [ ] User training completed
- [ ] Go-live scheduled

---

**Last Updated:** November 4, 2025
**Version:** 1.0
**Maintained By:** Largo Laboratory IT Team
