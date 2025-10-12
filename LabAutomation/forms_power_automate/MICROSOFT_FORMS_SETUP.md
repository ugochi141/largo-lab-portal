# 📝 Microsoft Forms Setup Guide

## Form 1: Largo Lab Inventory Update

### Form Settings
- **Form Name**: "Largo Lab Inventory Update"
- **Description**: "Update inventory levels, add new items, and report issues for MOB and AUC labs"
- **Sharing**: Anyone in Kaiser Permanente with the link can respond
- **Response collection**: Collect responses
- **One response per person**: No (multiple updates allowed)

### Section 1: Basic Information

#### Question 1: Staff Name
- **Type**: Text
- **Required**: Yes
- **Placeholder**: "Enter your full name"
- **Character limit**: 100

#### Question 2: Lab Location
- **Type**: Choice
- **Required**: Yes
- **Options**:
  - MOB Lab (Core)
  - AUC Lab (STAT)
  - Both Labs
- **Default**: MOB Lab (Core)

#### Question 3: Update Type
- **Type**: Choice
- **Required**: Yes
- **Options**:
  - Daily Count Update
  - New Item Addition
  - Stock Issue Report
  - Expiration Alert
  - Supplier ID Correction
- **Branching**: Yes (show different questions based on selection)

#### Question 4: Date/Time
- **Type**: Date
- **Required**: Yes
- **Default**: Today

### Section 2: Item Details

#### Question 5: Item Number
- **Type**: Text
- **Required**: No
- **Placeholder**: "e.g., CH001, HE001 (leave blank for new items)"
- **Character limit**: 20

#### Question 6: Item Description
- **Type**: Text
- **Required**: Yes
- **Placeholder**: "Full product name"
- **Character limit**: 200

#### Question 7: Category
- **Type**: Choice
- **Required**: Yes
- **Options**:
  - CHEMISTRY
  - HEMATOLOGY
  - URINALYSIS
  - KITS
  - MISCELLANEOUS

#### Question 8: Manufacturer
- **Type**: Text
- **Required**: No
- **Placeholder**: "e.g., Roche, Sysmex, BD"
- **Character limit**: 100

#### Question 9: Catalog Number
- **Type**: Text
- **Required**: No
- **Placeholder**: "Manufacturer catalog number"
- **Character limit**: 50

#### Question 10: Kaiser Material Number
- **Type**: Text
- **Required**: No
- **Placeholder**: "KAISER#/OLID"
- **Character limit**: 50

#### Question 11: Supplier ID
- **Type**: Text
- **Required**: No
- **Placeholder**: "For ordering"
- **Character limit**: 20

### Section 3: Stock Information

#### Question 12: Current Hand Count
- **Type**: Number
- **Required**: Yes
- **Minimum**: 0
- **Placeholder**: "Physical count"

#### Question 13: Package Size
- **Type**: Text
- **Required**: No
- **Placeholder**: "e.g., 800 tests, 20L, 100/box"
- **Character limit**: 100

#### Question 14: Unit of Measure
- **Type**: Choice
- **Required**: No
- **Options**:
  - Pack
  - Each
  - Box
  - Case
  - Bottle
  - Vial
  - mL
  - L

#### Question 15: Storage Location
- **Type**: Text
- **Required**: No
- **Placeholder**: "e.g., Refrigerator #1, Supply Room A"
- **Character limit**: 100

#### Question 16: Storage Temperature
- **Type**: Choice
- **Required**: No
- **Options**:
  - Room Temp
  - 2-8°C
  - -20°C
  - Other

### Section 4: Critical Information

#### Question 17: Is Critical Item
- **Type**: Choice
- **Required**: Yes
- **Options**:
  - Yes
  - No
- **Default**: No

#### Question 18: Expiration Date
- **Type**: Date
- **Required**: No
- **Description**: "For reagents and time-sensitive items"

#### Question 19: Lot Number
- **Type**: Text
- **Required**: No
- **Placeholder**: "For tracking"
- **Character limit**: 50

#### Question 20: Analyzer/Equipment
- **Type**: Text
- **Required**: No
- **Placeholder**: "e.g., Roche c303, Sysmex XN-1000"
- **Character limit**: 100

#### Question 21: Test/Procedure
- **Type**: Text
- **Required**: No
- **Placeholder**: "What test this item is used for"
- **Character limit**: 100

### Section 5: Issues and Notes

#### Question 22: Issue Type
- **Type**: Choice
- **Required**: No
- **Options**:
  - None
  - Low Stock Alert
  - Out of Stock
  - Expiring Soon
  - Supplier ID Error
  - Damaged Item
  - Wrong Item Received
  - Other

#### Question 23: Priority
- **Type**: Choice
- **Required**: No
- **Options**:
  - Low
  - Medium
  - High
  - Critical
- **Default**: Medium

#### Question 24: Notes
- **Type**: Long text
- **Required**: No
- **Placeholder**: "Additional details, issues, or special instructions"
- **Character limit**: 1000

#### Question 25: Action Required
- **Type**: Long text
- **Required**: No
- **Placeholder**: "What needs to be done (ordering, redistribution, etc.)"
- **Character limit**: 1000

---

## Form 2: ALT Reagent Redistribution Request

### Form Settings
- **Form Name**: "ALT Reagent Redistribution Request"
- **Description**: "Request redistribution of excess ALT reagents before October 31 expiration"
- **Sharing**: Anyone in Kaiser Permanente with the link can respond
- **Response collection**: Collect responses
- **One response per person**: No

### Section 1: Request Information

#### Question 1: Requestor Name
- **Type**: Text
- **Required**: Yes
- **Placeholder**: "Your full name"
- **Character limit**: 100

#### Question 2: Lab Location
- **Type**: Choice
- **Required**: Yes
- **Options**:
  - MOB Lab
  - AUC Lab

#### Question 3: Current ALT Stock
- **Type**: Number
- **Required**: Yes
- **Minimum**: 0
- **Description**: "How many ALT packs do you currently have?"

### Section 2: Redistribution Details

#### Question 4: Packs to Redistribute
- **Type**: Number
- **Required**: Yes
- **Minimum**: 1
- **Maximum**: 17
- **Description**: "How many packs can you send to other locations?"

#### Question 5: Preferred Recipients
- **Type**: Choice
- **Required**: No
- **Multiple answers**: Yes
- **Options**:
  - Kaiser Oakland
  - Kaiser San Francisco
  - Kaiser San Jose
  - Kaiser Santa Clara
  - Kaiser Fremont
  - Other Kaiser Location

#### Question 6: Other Location
- **Type**: Text
- **Required**: No (conditional on "Other Kaiser Location")
- **Placeholder**: "Specify the location name"
- **Character limit**: 100

#### Question 7: Contact Person
- **Type**: Text
- **Required**: Yes
- **Placeholder**: "Who to contact at receiving location"
- **Character limit**: 100

#### Question 8: Contact Email/Phone
- **Type**: Text
- **Required**: Yes
- **Placeholder**: "Contact information"
- **Character limit**: 100

### Section 3: Urgency

#### Question 9: Urgency Level
- **Type**: Choice
- **Required**: Yes
- **Options**:
  - Normal
  - Urgent
  - Critical
- **Default**: Urgent

#### Question 10: Special Instructions
- **Type**: Long text
- **Required**: No
- **Placeholder**: "Any special handling or delivery requirements"
- **Character limit**: 500

---

## 🔧 Form Configuration Steps

### Step 1: Create Forms
1. Go to [forms.office.com](https://forms.office.com)
2. Sign in with Kaiser credentials
3. Click "New Form"
4. Follow the structure above for each form

### Step 2: Configure Branching Logic
1. Select "Update Type" question
2. Click "Add branching"
3. Set up different question flows:
   - **Daily Count Update**: Show stock questions
   - **New Item Addition**: Show all item details
   - **Stock Issue Report**: Show issue questions
   - **Expiration Alert**: Show expiration questions
   - **Supplier ID Correction**: Show supplier questions

### Step 3: Set Up Validation
1. **Hand Count**: Must be ≥ 0
2. **Packs to Redistribute**: Must be ≤ 17
3. **Email format**: For contact information
4. **Required fields**: Based on update type

### Step 4: Configure Sharing
1. **Sharing settings**: Anyone in Kaiser Permanente
2. **Response collection**: Enable
3. **One response per person**: Disable (allow multiple)
4. **Response notifications**: Enable

### Step 5: Test Forms
1. Submit test responses
2. Verify all fields work correctly
3. Test branching logic
4. Check validation rules

### Step 6: Deploy to Teams
1. Add forms to Teams channels
2. Create quick access links
3. Set up mobile access
4. Train staff on usage

---

## 📱 Mobile Configuration

### Microsoft Forms App
1. Download from App Store/Google Play
2. Sign in with Kaiser credentials
3. Add forms to favorites
4. Enable offline mode

### Teams Mobile Integration
1. Add forms to Teams mobile app
2. Pin to quick access
3. Set up push notifications
4. Configure offline sync

---

## 🔐 Security Settings

### Access Control
- **Internal only**: Kaiser Permanente users
- **No external sharing**: Disabled
- **Response anonymity**: Disabled (track who submitted)

### Data Protection
- **Response encryption**: Enabled
- **Audit logging**: Enabled
- **Data retention**: 1 year
- **Export restrictions**: Admin only

---

## 📊 Response Management

### Viewing Responses
1. Go to form in Microsoft Forms
2. Click "Responses" tab
3. View individual responses
4. Export to Excel if needed

### Power Automate Integration
1. Responses automatically trigger flows
2. Real-time processing
3. Excel updates
4. Email notifications

### Monitoring
1. Track response volume
2. Monitor completion rates
3. Identify common issues
4. Generate reports

---

*This setup provides complete form functionality for inventory management with proper validation, branching, and integration capabilities.*



