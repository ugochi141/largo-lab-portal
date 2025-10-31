# 🔄 Power Automate Flow Implementation Details

## Flow 1: Inventory Update Processing

### Trigger
- **Type**: When a new response is submitted
- **Form**: "Largo Lab Inventory Update"
- **Frequency**: Real-time

### Actions

#### 1. Get Response Details
```json
{
  "action": "Get response details",
  "inputs": {
    "formId": "inventory-update-form",
    "responseId": "@triggerOutputs()?['body/responseId']"
  }
}
```

#### 2. Initialize Variables
```json
{
  "action": "Initialize variable",
  "inputs": {
    "variables": [
      {
        "name": "itemExists",
        "type": "boolean",
        "value": false
      },
      {
        "name": "excelRow",
        "type": "integer", 
        "value": 0
      },
      {
        "name": "category",
        "type": "string",
        "value": "@outputs('Get_response_details')?['body/category']"
      }
    ]
  }
}
```

#### 3. Check if Item Exists
```json
{
  "action": "List rows present in a table",
  "inputs": {
    "location": "SharePoint",
    "documentLibrary": "Largo Lab Inventory",
    "file": "LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx",
    "table": "@{variables('category')}",
    "filterQuery": "Item Number eq '@{outputs('Get_response_details')?['body/itemNumber']}'"
  }
}
```

#### 4. Conditional Logic - Update or Add
```json
{
  "action": "Condition",
  "inputs": {
    "expression": "@greater(length(outputs('List_rows_present_in_a_table')?['body/value']), 0)",
    "true": {
      "actions": [
        {
          "action": "Update a row",
          "inputs": {
            "location": "SharePoint",
            "documentLibrary": "Largo Lab Inventory", 
            "file": "LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx",
            "table": "@{variables('category')}",
            "id": "@outputs('List_rows_present_in_a_table')?['body/value'][0]['id']",
            "item": {
              "Hand Count": "@outputs('Get_response_details')?['body/handCount']",
              "Last Updated": "@utcNow()",
              "Updated By": "@outputs('Get_response_details')?['body/staffName']",
              "Notes": "@outputs('Get_response_details')?['body/notes']"
            }
          }
        }
      ]
    },
    "false": {
      "actions": [
        {
          "action": "Add a row",
          "inputs": {
            "location": "SharePoint",
            "documentLibrary": "Largo Lab Inventory",
            "file": "LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx", 
            "table": "@{variables('category')}",
            "item": {
              "Item #": "@{outputs('Get_response_details')?['body/itemNumber']}",
              "Description": "@outputs('Get_response_details')?['body/itemDescription']",
              "Manufacturer": "@outputs('Get_response_details')?['body/manufacturer']",
              "Hand Count": "@outputs('Get_response_details')?['body/handCount']",
              "Location (MOB/AUC)": "@outputs('Get_response_details')?['body/labLocation']",
              "Last Updated": "@utcNow()",
              "Updated By": "@outputs('Get_response_details')?['body/staffName']"
            }
          }
        }
      ]
    }
  }
}
```

#### 5. Calculate Status
```json
{
  "action": "Run JavaScript",
  "inputs": {
    "code": "var handCount = parseInt(workflowContext.trigger.outputs.body.handCount);\nvar parLevel = parseInt(workflowContext.trigger.outputs.body.parLevel);\nvar minStock = parseInt(workflowContext.trigger.outputs.body.minStock);\n\nvar status;\nif (handCount === 0) {\n  status = 'OUT OF STOCK';\n} else if (handCount <= minStock) {\n  status = 'CRITICAL LOW';\n} else if (handCount < 10) {\n  status = 'LOW STOCK';\n} else {\n  status = 'OK';\n}\n\nreturn { status: status };"
  }
}
```

#### 6. Send Notification (if Critical)
```json
{
  "action": "Condition",
  "inputs": {
    "expression": "@or(equals(outputs('Calculate_Status')?['status'], 'OUT OF STOCK'), equals(outputs('Calculate_Status')?['status'], 'CRITICAL LOW'))",
    "true": {
      "actions": [
        {
          "action": "Send an email (V2)",
          "inputs": {
            "to": "lorraine@kaiser.org;ingrid.benitez-ruiz@kaiser.org",
            "subject": "URGENT: Critical Inventory Item - @{outputs('Get_response_details')?['body/itemDescription']}",
            "body": "<p>Critical inventory item reported:</p><ul><li>Item: @{outputs('Get_response_details')?['body/itemDescription']}</li><li>Current Count: @{outputs('Get_response_details')?['body/handCount']}</li><li>Status: @{outputs('Calculate_Status')?['status']}</li><li>Reported by: @{outputs('Get_response_details')?['body/staffName']}</li><li>Location: @{outputs('Get_response_details')?['body/labLocation']}</li></ul>",
            "isHtml": true
          }
        }
      ]
    }
  }
}
```

---

## Flow 2: ALT Redistribution Request

### Trigger
- **Type**: When a new response is submitted
- **Form**: "ALT Reagent Redistribution Request"
- **Frequency**: Real-time

### Actions

#### 1. Get Response Details
```json
{
  "action": "Get response details",
  "inputs": {
    "formId": "alt-redistribution-form",
    "responseId": "@triggerOutputs()?['body/responseId']"
  }
}
```

#### 2. Send Urgent Email
```json
{
  "action": "Send an email (V2)",
  "inputs": {
    "to": "nathaniel.burmeister@kaiser.org;john.ekpe@kaiser.org;ingrid.benitez-ruiz@kaiser.org",
    "subject": "URGENT: ALT Reagent Redistribution Request - @{outputs('Get_response_details')?['body/requestorName']}",
    "body": "<h2>ALT Reagent Redistribution Request</h2><p><strong>Requestor:</strong> @{outputs('Get_response_details')?['body/requestorName']}</p><p><strong>Lab Location:</strong> @{outputs('Get_response_details')?['body/labLocation']}</p><p><strong>Current Stock:</strong> @{outputs('Get_response_details')?['body/currentStock']} packs</p><p><strong>Packs to Redistribute:</strong> @{outputs('Get_response_details')?['body/packsToRedistribute']} packs</p><p><strong>Preferred Recipients:</strong> @{outputs('Get_response_details')?['body/preferredRecipients']}</p><p><strong>Contact Person:</strong> @{outputs('Get_response_details')?['body/contactPerson']}</p><p><strong>Contact Info:</strong> @{outputs('Get_response_details')?['body/contactInfo']}</p><p><strong>Urgency:</strong> @{outputs('Get_response_details')?['body/urgencyLevel']}</p><p><strong>Special Instructions:</strong> @{outputs('Get_response_details')?['body/specialInstructions']}</p><br><p><strong>ACTION REQUIRED:</strong> Contact other Kaiser locations immediately to redistribute before October 31 expiration!</p>",
    "isHtml": true,
    "importance": "High"
  }
}
```

#### 3. Update Excel Inventory
```json
{
  "action": "Update a row",
  "inputs": {
    "location": "SharePoint",
    "documentLibrary": "Largo Lab Inventory",
    "file": "LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx",
    "table": "CHEMISTRY",
    "id": "ALT_ROW_ID",
    "item": {
      "Hand Count": "@sub(outputs('Get_response_details')?['body/currentStock'], outputs('Get_response_details')?['body/packsToRedistribute'])",
      "Last Updated": "@utcNow()",
      "Updated By": "@{outputs('Get_response_details')?['body/requestorName']}",
      "Notes": "Redistributed @{outputs('Get_response_details')?['body/packsToRedistribute']} packs - Contact: @{outputs('Get_response_details')?['body/contactPerson']}"
    }
  }
}
```

#### 4. Create Follow-up Task
```json
{
  "action": "Create a task",
  "inputs": {
    "taskListId": "TASK_LIST_ID",
    "body": {
      "title": "ALT Redistribution Follow-up - @{outputs('Get_response_details')?['body/requestorName']}",
      "body": "Follow up on ALT reagent redistribution request. Packs to redistribute: @{outputs('Get_response_details')?['body/packsToRedistribute']}. Contact: @{outputs('Get_response_details')?['body/contactPerson']}",
      "dueDateTime": "@addDays(utcNow(), 3)"
    }
  }
}
```

---

## Flow 3: Daily Inventory Check

### Trigger
- **Type**: Recurrence
- **Frequency**: Daily at 7:00 AM
- **Days**: Monday through Friday

### Actions

#### 1. Read All Excel Data
```json
{
  "action": "List rows present in a table",
  "inputs": {
    "location": "SharePoint",
    "documentLibrary": "Largo Lab Inventory",
    "file": "LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx",
    "table": "CHEMISTRY"
  }
}
```

#### 2. Check Stock Levels
```json
{
  "action": "Filter array",
  "inputs": {
    "from": "@outputs('List_rows_present_in_a_table')?['body/value']",
    "where": "@and(lessOrEquals(item()['Hand Count'], item()['REORDER POINT']), greater(item()['Hand Count'], 0))"
  }
}
```

#### 3. Check Expiring Items
```json
{
  "action": "Filter array", 
  "inputs": {
    "from": "@outputs('List_rows_present_in_a_table')?['body/value']",
    "where": "@and(not(empty(item()['EXPIRATION DATE'])), lessOrEquals(item()['EXPIRATION DATE'], addDays(utcNow(), 30)))"
  }
}
```

#### 4. Generate Order Email
```json
{
  "action": "Create HTML table",
  "inputs": {
    "columns": [
      {
        "header": "Item",
        "value": "@item()['DESCRIPTION']"
      },
      {
        "header": "Current",
        "value": "@item()['Hand Count']"
      },
      {
        "header": "Reorder Point", 
        "value": "@item()['REORDER POINT']"
      },
      {
        "header": "Order Qty",
        "value": "@sub(item()['PAR LEVEL'], item()['Hand Count'])"
      }
    ],
    "from": "@outputs('Check_Stock_Levels')"
  }
}
```

#### 5. Send Order Email
```json
{
  "action": "Send an email (V2)",
  "inputs": {
    "to": "nathaniel.burmeister@kaiser.org",
    "cc": "lorraine@kaiser.org;ingrid.benitez-ruiz@kaiser.org",
    "subject": "Daily Lab Supply Order Request - @{formatDateTime(utcNow(), 'yyyy-MM-dd')}",
    "body": "<h2>Largo Lab Daily Inventory Check</h2><p>Items requiring reorder:</p>@{outputs('Generate_Order_Email')}<p>Please process these orders as soon as possible.</p>",
    "isHtml": true
  }
}
```

---

## Flow 4: Supplier ID Verification

### Trigger
- **Type**: When a new response is submitted
- **Condition**: Issue Type = "Supplier ID Error"
- **Form**: "Largo Lab Inventory Update"

### Actions

#### 1. Get Error Details
```json
{
  "action": "Get response details",
  "inputs": {
    "formId": "inventory-update-form",
    "responseId": "@triggerOutputs()?['body/responseId']"
  }
}
```

#### 2. Create Verification Task
```json
{
  "action": "Create a task",
  "inputs": {
    "taskListId": "TASK_LIST_ID",
    "body": {
      "title": "Supplier ID Verification - @{outputs('Get_response_details')?['body/itemDescription']}",
      "body": "Item: @{outputs('Get_response_details')?['body/itemDescription']}\nCurrent Supplier ID: @{outputs('Get_response_details')?['body/supplierId']}\nReported by: @{outputs('Get_response_details')?['body/staffName']}\nNotes: @{outputs('Get_response_details')?['body/notes']}",
      "assignedTo": "maxwell.booker@kaiser.org",
      "dueDateTime": "@addDays(utcNow(), 2)"
    }
  }
}
```

#### 3. Send Notification
```json
{
  "action": "Send an email (V2)",
  "inputs": {
    "to": "maxwell.booker@kaiser.org",
    "subject": "Supplier ID Verification Request - @{outputs('Get_response_details')?['body/itemDescription']}",
    "body": "<p>New supplier ID verification request:</p><ul><li>Item: @{outputs('Get_response_details')?['body/itemDescription']}</li><li>Current Supplier ID: @{outputs('Get_response_details')?['body/supplierId']}</li><li>Reported by: @{outputs('Get_response_details')?['body/staffName']}</li><li>Location: @{outputs('Get_response_details')?['body/labLocation']}</li><li>Notes: @{outputs('Get_response_details')?['body/notes']}</li></ul><p>Please verify and correct the supplier ID as soon as possible.</p>",
    "isHtml": true
  }
}
```

---

## 🔧 Setup Instructions

### 1. Create Power Automate Flows
1. Go to flow.microsoft.com
2. Sign in with Kaiser credentials
3. Create new flow for each configuration above
4. Test each flow with sample data

### 2. Connect to SharePoint
1. Ensure Excel file is in SharePoint
2. Grant Power Automate access to file
3. Test read/write permissions

### 3. Configure Email Settings
1. Update email addresses in flows
2. Set up proper SMTP settings
3. Test email delivery

### 4. Set Up Monitoring
1. Enable flow run history
2. Set up error notifications
3. Create monitoring dashboard

---

*This configuration provides complete automation from form submission to Excel updates and email notifications.*



