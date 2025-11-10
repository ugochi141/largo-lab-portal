#!/usr/bin/env python3
"""
Create Microsoft Forms and Power Automate solution for Lab Inventory
Generates forms, Power Automate flows, and integration scripts
"""

import json
from pathlib import Path
from datetime import datetime

class FormsPowerAutomateBuilder:
    def __init__(self):
        self.project_root = Path("/Users/ugochi141/Desktop/LabAutomation")
        self.forms_dir = self.project_root / "forms_power_automate"
        self.forms_dir.mkdir(exist_ok=True)
        
    def create_inventory_update_form(self):
        """Create the main inventory update form structure"""
        form_structure = {
            "form_name": "Largo Lab Inventory Update",
            "form_id": "inventory-update-form",
            "description": "Update inventory levels, add new items, and report issues",
            "sections": [
                {
                    "section_name": "Basic Information",
                    "fields": [
                        {
                            "field_name": "Staff Name",
                            "field_type": "text",
                            "required": True,
                            "placeholder": "Enter your full name"
                        },
                        {
                            "field_name": "Lab Location",
                            "field_type": "choice",
                            "required": True,
                            "options": ["MOB Lab (Core)", "AUC Lab (STAT)", "Both Labs"],
                            "default": "MOB Lab (Core)"
                        },
                        {
                            "field_name": "Update Type",
                            "field_type": "choice",
                            "required": True,
                            "options": [
                                "Daily Count Update",
                                "New Item Addition", 
                                "Stock Issue Report",
                                "Expiration Alert",
                                "Supplier ID Correction"
                            ]
                        },
                        {
                            "field_name": "Date/Time",
                            "field_type": "date",
                            "required": True,
                            "default": "today"
                        }
                    ]
                },
                {
                    "section_name": "Item Details",
                    "fields": [
                        {
                            "field_name": "Item Number",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "e.g., CH001, HE001 (leave blank for new items)"
                        },
                        {
                            "field_name": "Item Description",
                            "field_type": "text",
                            "required": True,
                            "placeholder": "Full product name"
                        },
                        {
                            "field_name": "Category",
                            "field_type": "choice",
                            "required": True,
                            "options": ["CHEMISTRY", "HEMATOLOGY", "URINALYSIS", "KITS", "MISCELLANEOUS"]
                        },
                        {
                            "field_name": "Manufacturer",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "e.g., Roche, Sysmex, BD"
                        },
                        {
                            "field_name": "Catalog Number",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "Manufacturer catalog number"
                        },
                        {
                            "field_name": "Kaiser Material Number",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "KAISER#/OLID"
                        },
                        {
                            "field_name": "Supplier ID",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "For ordering"
                        }
                    ]
                },
                {
                    "section_name": "Stock Information",
                    "fields": [
                        {
                            "field_name": "Current Hand Count",
                            "field_type": "number",
                            "required": True,
                            "min": 0,
                            "placeholder": "Physical count"
                        },
                        {
                            "field_name": "Package Size",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "e.g., 800 tests, 20L, 100/box"
                        },
                        {
                            "field_name": "Unit of Measure",
                            "field_type": "choice",
                            "required": False,
                            "options": ["Pack", "Each", "Box", "Case", "Bottle", "Vial", "mL", "L"]
                        },
                        {
                            "field_name": "Storage Location",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "e.g., Refrigerator #1, Supply Room A"
                        },
                        {
                            "field_name": "Storage Temperature",
                            "field_type": "choice",
                            "required": False,
                            "options": ["Room Temp", "2-8°C", "-20°C", "Other"]
                        }
                    ]
                },
                {
                    "section_name": "Critical Information",
                    "fields": [
                        {
                            "field_name": "Is Critical Item",
                            "field_type": "choice",
                            "required": True,
                            "options": ["Yes", "No"],
                            "default": "No"
                        },
                        {
                            "field_name": "Expiration Date",
                            "field_type": "date",
                            "required": False,
                            "description": "For reagents and time-sensitive items"
                        },
                        {
                            "field_name": "Lot Number",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "For tracking"
                        },
                        {
                            "field_name": "Analyzer/Equipment",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "e.g., Roche c303, Sysmex XN-1000"
                        },
                        {
                            "field_name": "Test/Procedure",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "What test this item is used for"
                        }
                    ]
                },
                {
                    "section_name": "Issues and Notes",
                    "fields": [
                        {
                            "field_name": "Issue Type",
                            "field_type": "choice",
                            "required": False,
                            "options": [
                                "None",
                                "Low Stock Alert",
                                "Out of Stock",
                                "Expiring Soon",
                                "Supplier ID Error",
                                "Damaged Item",
                                "Wrong Item Received",
                                "Other"
                            ]
                        },
                        {
                            "field_name": "Priority",
                            "field_type": "choice",
                            "required": False,
                            "options": ["Low", "Medium", "High", "Critical"],
                            "default": "Medium"
                        },
                        {
                            "field_name": "Notes",
                            "field_type": "longtext",
                            "required": False,
                            "placeholder": "Additional details, issues, or special instructions"
                        },
                        {
                            "field_name": "Action Required",
                            "field_type": "longtext",
                            "required": False,
                            "placeholder": "What needs to be done (ordering, redistribution, etc.)"
                        }
                    ]
                }
            ]
        }
        
        return form_structure
    
    def create_alt_redistribution_form(self):
        """Create special form for ALT reagent redistribution"""
        form_structure = {
            "form_name": "ALT Reagent Redistribution Request",
            "form_id": "alt-redistribution-form",
            "description": "Request redistribution of excess ALT reagents before October 31 expiration",
            "sections": [
                {
                    "section_name": "Request Information",
                    "fields": [
                        {
                            "field_name": "Requestor Name",
                            "field_type": "text",
                            "required": True
                        },
                        {
                            "field_name": "Lab Location",
                            "field_type": "choice",
                            "required": True,
                            "options": ["MOB Lab", "AUC Lab"]
                        },
                        {
                            "field_name": "Current ALT Stock",
                            "field_type": "number",
                            "required": True,
                            "min": 0,
                            "description": "How many ALT packs do you currently have?"
                        }
                    ]
                },
                {
                    "section_name": "Redistribution Details",
                    "fields": [
                        {
                            "field_name": "Packs to Redistribute",
                            "field_type": "number",
                            "required": True,
                            "min": 1,
                            "max": 17,
                            "description": "How many packs can you send to other locations?"
                        },
                        {
                            "field_name": "Preferred Recipients",
                            "field_type": "choice",
                            "required": False,
                            "multiple": True,
                            "options": [
                                "Kaiser Oakland",
                                "Kaiser San Francisco", 
                                "Kaiser San Jose",
                                "Kaiser Santa Clara",
                                "Kaiser Fremont",
                                "Other Kaiser Location"
                            ]
                        },
                        {
                            "field_name": "Other Location",
                            "field_type": "text",
                            "required": False,
                            "placeholder": "If 'Other Kaiser Location' selected"
                        },
                        {
                            "field_name": "Contact Person",
                            "field_type": "text",
                            "required": True,
                            "placeholder": "Who to contact at receiving location"
                        },
                        {
                            "field_name": "Contact Email/Phone",
                            "field_type": "text",
                            "required": True,
                            "placeholder": "Contact information"
                        }
                    ]
                },
                {
                    "section_name": "Urgency",
                    "fields": [
                        {
                            "field_name": "Urgency Level",
                            "field_type": "choice",
                            "required": True,
                            "options": ["Normal", "Urgent", "Critical"],
                            "default": "Urgent"
                        },
                        {
                            "field_name": "Special Instructions",
                            "field_type": "longtext",
                            "required": False,
                            "placeholder": "Any special handling or delivery requirements"
                        }
                    ]
                }
            ]
        }
        
        return form_structure
    
    def create_power_automate_flows(self):
        """Create Power Automate flow configurations"""
        flows = {
            "inventory_update_flow": {
                "name": "Lab Inventory Update Flow",
                "trigger": "When a new response is submitted to 'Largo Lab Inventory Update'",
                "description": "Processes inventory updates and updates Excel spreadsheet",
                "steps": [
                    {
                        "step": 1,
                        "action": "Get response details",
                        "description": "Extract all form responses"
                    },
                    {
                        "step": 2,
                        "action": "Conditional logic",
                        "description": "Check if item exists in Excel (by Item Number or Description)"
                    },
                    {
                        "step": 3,
                        "action": "Update Excel row",
                        "description": "If item exists, update the existing row with new data"
                    },
                    {
                        "step": 4,
                        "action": "Add new Excel row",
                        "description": "If new item, add to appropriate category sheet"
                    },
                    {
                        "step": 5,
                        "action": "Calculate status",
                        "description": "Auto-calculate STATUS based on hand count vs PAR level"
                    },
                    {
                        "step": 6,
                        "action": "Send notification",
                        "description": "Email Lorraine/Ingrid if critical items or issues"
                    },
                    {
                        "step": 7,
                        "action": "Log update",
                        "description": "Record update in audit log"
                    }
                ]
            },
            "alt_redistribution_flow": {
                "name": "ALT Redistribution Flow",
                "trigger": "When a new response is submitted to 'ALT Reagent Redistribution Request'",
                "description": "Handles urgent ALT reagent redistribution requests",
                "steps": [
                    {
                        "step": 1,
                        "action": "Get response details",
                        "description": "Extract redistribution request data"
                    },
                    {
                        "step": 2,
                        "action": "Send urgent email",
                        "description": "Email Nathaniel Burmeister, John F Ekpe, and Ingrid immediately"
                    },
                    {
                        "step": 3,
                        "action": "Update inventory",
                        "description": "Reduce ALT count in Excel by redistributed amount"
                    },
                    {
                        "step": 4,
                        "action": "Create task",
                        "description": "Create follow-up task for redistribution completion"
                    },
                    {
                        "step": 5,
                        "action": "Send confirmation",
                        "description": "Confirm receipt to requestor"
                    }
                ]
            },
            "daily_inventory_check_flow": {
                "name": "Daily Inventory Check Flow",
                "trigger": "Scheduled daily at 7:00 AM",
                "description": "Automated daily inventory monitoring and email alerts",
                "steps": [
                    {
                        "step": 1,
                        "action": "Read Excel data",
                        "description": "Get all inventory data from all sheets"
                    },
                    {
                        "step": 2,
                        "action": "Check stock levels",
                        "description": "Identify items below reorder point"
                    },
                    {
                        "step": 3,
                        "action": "Check expirations",
                        "description": "Find items expiring within 30 days"
                    },
                    {
                        "step": 4,
                        "action": "Generate email",
                        "description": "Create order request email for Nathaniel"
                    },
                    {
                        "step": 5,
                        "action": "Send email",
                        "description": "Send to supply coordinator with CC to managers"
                    },
                    {
                        "step": 6,
                        "action": "Update dashboard",
                        "description": "Update status in Teams channel"
                    }
                ]
            },
            "supplier_id_verification_flow": {
                "name": "Supplier ID Verification Flow",
                "trigger": "When 'Supplier ID Error' is selected in inventory form",
                "description": "Handles supplier ID corrections and verification",
                "steps": [
                    {
                        "step": 1,
                        "action": "Get error details",
                        "description": "Extract item and supplier ID information"
                    },
                    {
                        "step": 2,
                        "action": "Create verification task",
                        "description": "Assign to Maxwell Booker for verification"
                    },
                    {
                        "step": 3,
                        "action": "Send notification",
                        "description": "Email Maxwell with correction request"
                    },
                    {
                        "step": 4,
                        "action": "Track resolution",
                        "description": "Monitor until supplier ID is corrected"
                    }
                ]
            }
        }
        
        return flows
    
    def create_excel_integration_script(self):
        """Create VBA script for Excel integration"""
        vba_code = '''
        ' VBA Code for Excel Integration with Power Automate
        ' Place this in the Excel workbook's VBA editor
        
        Sub UpdateInventoryFromForm()
            ' This subroutine updates inventory when called by Power Automate
            Dim ws As Worksheet
            Dim lastRow As Long
            Dim itemNum As String
            Dim description As String
            Dim handCount As Long
            Dim category As String
            
            ' Get parameters from Power Automate
            itemNum = Range("A1").Value ' Power Automate will put data here
            description = Range("B1").Value
            handCount = Range("C1").Value
            category = Range("D1").Value
            
            ' Determine which sheet to update
            Select Case UCase(category)
                Case "CHEMISTRY"
                    Set ws = Worksheets("CHEMISTRY")
                Case "HEMATOLOGY"
                    Set ws = Worksheets("HEMATOLOGY")
                Case "URINALYSIS"
                    Set ws = Worksheets("URINALYSIS")
                Case "KITS"
                    Set ws = Worksheets("KITS")
                Case "MISCELLANEOUS"
                    Set ws = Worksheets("MISCELLANEOUS")
                Case Else
                    MsgBox "Invalid category: " & category
                    Exit Sub
            End Select
            
            ' Find existing item or add new
            If itemNum <> "" Then
                ' Update existing item
                lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
                For i = 2 To lastRow
                    If ws.Cells(i, 1).Value = itemNum Then
                        ' Update the row
                        ws.Cells(i, 13).Value = handCount ' Hand Count column
                        ws.Cells(i, 27).Value = Now() ' Last Updated
                        ws.Cells(i, 28).Value = "Form Update" ' Updated By
                        
                        ' Recalculate status
                        Call CalculateItemStatus(ws, i)
                        Exit For
                    End If
                Next i
            Else
                ' Add new item
                lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row + 1
                ws.Cells(lastRow, 2).Value = description
                ws.Cells(lastRow, 13).Value = handCount
                ws.Cells(lastRow, 27).Value = Now()
                ws.Cells(lastRow, 28).Value = "Form Update"
                
                ' Calculate status for new item
                Call CalculateItemStatus(ws, lastRow)
            End If
            
            ' Save the workbook
            ThisWorkbook.Save
            
            ' Clear the input area
            Range("A1:D1").ClearContents
        End Sub
        
        Sub CalculateItemStatus(ws As Worksheet, row As Long)
            ' Calculate status based on hand count vs PAR level
            Dim handCount As Long
            Dim parLevel As Long
            Dim minStock As Long
            Dim status As String
            
            handCount = ws.Cells(row, 13).Value ' Hand Count
            parLevel = ws.Cells(row, 10).Value ' PAR Level
            minStock = ws.Cells(row, 11).Value ' Min Stock
            
            If handCount = 0 Then
                status = "OUT OF STOCK"
            ElseIf handCount <= minStock Then
                status = "CRITICAL LOW"
            ElseIf handCount < 10 Then
                status = "LOW STOCK"
            Else
                status = "OK"
            End If
            
            ws.Cells(row, 16).Value = status ' Status column
        End Sub
        
        Sub SendInventoryAlert()
            ' Send alert if critical items found
            Dim ws As Worksheet
            Dim lastRow As Long
            Dim criticalCount As Long
            Dim alertMessage As String
            
            criticalCount = 0
            alertMessage = "Critical inventory items found:" & vbCrLf & vbCrLf
            
            ' Check all sheets for critical items
            For Each ws In Worksheets
                If ws.Name <> "DASHBOARD" And ws.Name <> "EXPIRING_ITEMS" Then
                    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
                    For i = 2 To lastRow
                        If ws.Cells(i, 16).Value = "OUT OF STOCK" Or ws.Cells(i, 16).Value = "CRITICAL LOW" Then
                            criticalCount = criticalCount + 1
                            alertMessage = alertMessage & ws.Name & ": " & ws.Cells(i, 2).Value & vbCrLf
                        End If
                    Next i
                End If
            Next ws
            
            If criticalCount > 0 Then
                MsgBox alertMessage, vbCritical, "Inventory Alert"
            End If
        End Sub
        '''
        
        return vba_code
    
    def create_teams_integration(self):
        """Create Teams integration configuration"""
        teams_config = {
            "teams_app": {
                "name": "Lab Inventory Bot",
                "description": "Automated inventory management for Largo Labs",
                "capabilities": [
                    "Form submission notifications",
                    "Daily inventory summaries",
                    "Critical item alerts",
                    "Order status updates"
                ]
            },
            "channels": [
                {
                    "name": "Lab Inventory Updates",
                    "purpose": "Real-time inventory updates and form submissions"
                },
                {
                    "name": "Supply Orders",
                    "purpose": "Order requests and status updates"
                },
                {
                    "name": "Critical Alerts",
                    "purpose": "Urgent inventory issues and expiring items"
                }
            ],
            "adaptive_cards": [
                {
                    "name": "Inventory Update Card",
                    "template": {
                        "type": "AdaptiveCard",
                        "body": [
                            {
                                "type": "TextBlock",
                                "text": "New Inventory Update",
                                "weight": "Bolder",
                                "size": "Medium"
                            },
                            {
                                "type": "FactSet",
                                "facts": [
                                    {"title": "Staff", "value": "${staffName}"},
                                    {"title": "Location", "value": "${labLocation}"},
                                    {"title": "Item", "value": "${itemDescription}"},
                                    {"title": "Count", "value": "${handCount}"},
                                    {"title": "Status", "value": "${status}"}
                                ]
                            }
                        ]
                    }
                }
            ]
        }
        
        return teams_config
    
    def generate_implementation_guide(self):
        """Generate complete implementation guide"""
        guide = f"""
# Microsoft Forms + Power Automate Integration Guide

## Overview
This solution connects Microsoft Forms to your Excel inventory sheets using Power Automate, enabling real-time inventory updates from any device.

## 📋 Forms Created

### 1. Main Inventory Update Form
- **Purpose**: Daily inventory updates, new items, issue reporting
- **Fields**: 20+ fields covering all inventory aspects
- **Integration**: Directly updates Excel sheets via Power Automate

### 2. ALT Redistribution Form  
- **Purpose**: Urgent redistribution of excess ALT reagents
- **Fields**: Request details, recipient selection, urgency level
- **Integration**: Immediate email alerts to supply team

## 🔄 Power Automate Flows

### Flow 1: Inventory Update Processing
```
Trigger: Form submission
↓
Extract form data
↓
Check if item exists in Excel
↓
Update existing row OR Add new row
↓
Calculate status (OK/LOW/CRITICAL)
↓
Send notification if critical
↓
Log update in audit trail
```

### Flow 2: ALT Redistribution
```
Trigger: ALT redistribution form
↓
Extract request details
↓
Send urgent email to Nathaniel + team
↓
Update Excel inventory count
↓
Create follow-up task
↓
Send confirmation to requestor
```

### Flow 3: Daily Automated Check
```
Trigger: Scheduled daily 7:00 AM
↓
Read all Excel data
↓
Identify low stock items
↓
Check expiring items
↓
Generate order email
↓
Send to supply coordinator
↓
Update Teams dashboard
```

### Flow 4: Supplier ID Verification
```
Trigger: Supplier ID error reported
↓
Create verification task
↓
Assign to Maxwell Booker
↓
Send notification email
↓
Track until resolved
```

## 🛠️ Implementation Steps

### Step 1: Create Microsoft Forms
1. Go to forms.office.com
2. Create new form: "Largo Lab Inventory Update"
3. Add all fields from the form structure
4. Set up branching logic for different update types
5. Configure sharing permissions

### Step 2: Set Up Power Automate
1. Go to flow.microsoft.com
2. Create new flow from template
3. Connect to your Excel file in SharePoint
4. Set up triggers and actions
5. Test with sample data

### Step 3: Excel Integration
1. Add VBA code to your Excel workbook
2. Enable macros and Power Automate integration
3. Set up data validation and formulas
4. Configure automatic calculations

### Step 4: Teams Integration
1. Add Power Automate app to Teams
2. Create inventory channels
3. Set up adaptive cards for notifications
4. Configure bot responses

## 📊 Data Flow

```
Staff fills form on mobile/desktop
↓
Power Automate processes submission
↓
Updates Excel sheet in real-time
↓
Triggers status calculations
↓
Sends notifications if needed
↓
Logs all changes for audit
```

## 🔧 Configuration Files

### Power Automate Connection Settings
```json
{{
    "excel_connection": {{
        "file_location": "SharePoint/Teams/Largo Lab/Inventory",
        "file_name": "LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx",
        "sheets": ["CHEMISTRY", "HEMATOLOGY", "URINALYSIS", "KITS", "MISCELLANEOUS"]
    }},
    "email_settings": {{
        "supply_coordinator": "nathaniel.burmeister@kaiser.org",
        "inventory_managers": ["lorraine@kaiser.org", "ingrid.benitez-ruiz@kaiser.org"],
        "urgent_contacts": ["john.ekpe@kaiser.org", "maxwell.booker@kaiser.org"]
    }},
    "notifications": {{
        "critical_items": "immediate",
        "low_stock": "daily_summary",
        "expiring_items": "weekly_alert"
    }}
}}
```

## 📱 Mobile Access

### Forms Mobile App
- Download Microsoft Forms app
- Access forms via QR code or link
- Offline capability for data entry
- Photo attachments for damaged items

### Teams Mobile Integration
- Real-time notifications
- Quick form access
- Status updates
- Emergency alerts

## 🔐 Security & Compliance

### Data Protection
- All data stays within Kaiser network
- HIPAA-compliant forms and storage
- Audit trail for all changes
- Role-based access control

### User Permissions
- **Staff**: Submit forms, view status
- **Managers**: Approve orders, view reports
- **IT**: System administration
- **Supply**: Order processing, status updates

## 📈 Benefits

1. **Real-time Updates**: Instant inventory changes
2. **Mobile Access**: Update from anywhere in lab
3. **Automated Alerts**: Never miss critical items
4. **Audit Trail**: Complete change history
5. **Integration**: Works with existing Excel system
6. **Scalability**: Easy to add new forms/fields

## 🚀 Quick Start

1. **Create Forms** (30 minutes)
   - Set up both inventory forms
   - Configure field validation
   - Test with sample data

2. **Build Power Automate Flows** (2 hours)
   - Connect to Excel file
   - Set up triggers and actions
   - Test each flow

3. **Deploy to Teams** (1 hour)
   - Add forms to Teams
   - Set up notifications
   - Train staff

4. **Go Live** (1 day)
   - Full system testing
   - Staff training
   - Monitor for issues

## 📞 Support

**Technical Issues**: IT Help Desk
**Form Questions**: Lorraine or Ingrid  
**Power Automate**: Microsoft Support
**Training**: Lab IT Administrator

---

*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*
*Version: 1.0*
        """
        
        return guide
    
    def save_all_configurations(self):
        """Save all configuration files"""
        # Save form structures
        forms_config = {
            "inventory_update_form": self.create_inventory_update_form(),
            "alt_redistribution_form": self.create_alt_redistribution_form()
        }
        
        with open(self.forms_dir / "forms_configuration.json", 'w') as f:
            json.dump(forms_config, f, indent=2)
        
        # Save Power Automate flows
        flows = self.create_power_automate_flows()
        with open(self.forms_dir / "power_automate_flows.json", 'w') as f:
            json.dump(flows, f, indent=2)
        
        # Save VBA code
        vba_code = self.create_excel_integration_script()
        with open(self.forms_dir / "excel_vba_integration.vba", 'w') as f:
            f.write(vba_code)
        
        # Save Teams configuration
        teams_config = self.create_teams_integration()
        with open(self.forms_dir / "teams_integration.json", 'w') as f:
            json.dump(teams_config, f, indent=2)
        
        # Save implementation guide
        guide = self.generate_implementation_guide()
        with open(self.forms_dir / "IMPLEMENTATION_GUIDE.md", 'w') as f:
            f.write(guide)
        
        print(f"✅ All configurations saved to: {self.forms_dir}")
        return self.forms_dir

def main():
    print("Creating Microsoft Forms + Power Automate Solution")
    print("=" * 70)
    
    builder = FormsPowerAutomateBuilder()
    config_dir = builder.save_all_configurations()
    
    print("\n" + "=" * 70)
    print("📋 SOLUTION COMPONENTS CREATED:")
    print("=" * 70)
    print("✓ Microsoft Forms structures (2 forms)")
    print("✓ Power Automate flow configurations (4 flows)")
    print("✓ Excel VBA integration code")
    print("✓ Teams integration setup")
    print("✓ Complete implementation guide")
    
    print(f"\n📁 Files saved to: {config_dir}")
    print("\n🎯 NEXT STEPS:")
    print("1. Review IMPLEMENTATION_GUIDE.md")
    print("2. Create forms in Microsoft Forms")
    print("3. Set up Power Automate flows")
    print("4. Add VBA code to Excel workbook")
    print("5. Configure Teams integration")
    print("6. Test with sample data")
    print("7. Train staff on new system")

if __name__ == "__main__":
    main()



