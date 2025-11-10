# 📨 Lab Alerts Channel → Notion Forwarding Guide

## 🎯 **Goal: Forward ALL messages from Lab Alerts Channel to Notion**

Instead of monitoring for keywords across all channels, you want to forward **every message** posted to your **Lab Alerts Channel** directly to Notion.

## 🚀 **Power Automate Flow Setup**

### **Step 1: Create New Flow**
1. Go to: https://make.powerautomate.com
2. **Create** → **Automated cloud flow**
3. **Name**: "Lab Alerts Channel to Notion Forwarder"

### **Step 2: Configure Trigger**
**Trigger**: "When a new channel message is added"
- **Team**: Select your Kaiser Permanente team
- **Channel**: **Select ONLY your Lab Alerts Channel**
- **Include attachments**: Yes (to capture any files)

### **Step 3: Add Condition (Optional)**
You can either:
- **Option A**: Forward ALL messages (no condition)
- **Option B**: Add condition to filter certain messages

**For Option B - Add condition**:
```
length(triggerOutputs()?['body/body/plainTextContent']) is greater than 10
```
This filters out very short messages like "OK" or "Thanks"

### **Step 4: HTTP POST to Your Webhook**
**Action**: "HTTP"
- **Method**: POST
- **URI**: `https://your-railway-app.railway.app/webhook/teams-to-notion`
- **Headers**: 
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body**: 
  ```json
  {
    "text": "@{triggerOutputs()?['body/body/plainTextContent']}",
    "from": {
      "name": "@{triggerOutputs()?['body/from/user/displayName']}"
    },
    "channelData": {
      "channel": {
        "name": "@{triggerOutputs()?['body/channelIdentity/displayName']}"
      },
      "team": {
        "name": "@{triggerOutputs()?['body/channelIdentity/teamDisplayName']}"
      }
    },
    "messageId": "@{triggerOutputs()?['body/id']}",
    "timestamp": "@{utcNow()}",
    "webUrl": "@{triggerOutputs()?['body/webUrl']}",
    "messageType": "lab_alerts_forward",
    "priority": "high",
    "autoForwarded": true
  }
  ```

### **Step 5: Add Confirmation Message (Optional)**
**Action**: "Post message in a chat or channel" 
- **Channel**: Same Lab Alerts Channel
- **Message**: 
  ```
  ✅ **Message forwarded to Notion**
  
  📝 **Incident ID**: TEAMS-@{formatDateTime(utcNow(), 'yyyyMMdd-HHmmss')}
  👤 **Reporter**: @{triggerOutputs()?['body/from/user/displayName']}
  🕐 **Time**: @{utcNow()}
  
  🔗 **Notion**: Incident page created automatically
  ```

## 🛠 **Alternative: Simplified Version**

If you want **zero filtering** - forward everything:

### **Simple Flow**:
1. **Trigger**: When message posted to Lab Alerts Channel
2. **HTTP POST**: Send directly to your webhook
3. **Done** - No conditions, no confirmations

### **Webhook Body** (Simplified):
```json
{
  "text": "@{triggerOutputs()?['body/body/plainTextContent']}",
  "from": {
    "name": "@{triggerOutputs()?['body/from/user/displayName']}"
  },
  "channelData": {
    "channel": {
      "name": "Lab Alerts"
    },
    "team": {
      "name": "Kaiser Permanente Lab Team"
    }
  },
  "timestamp": "@{utcNow()}",
  "forwardAll": true
}
```

## 🎛 **Advanced Configuration**

### **Option 1: Priority-Based Forwarding**
Add multiple conditions for different priorities:

**High Priority Messages** (immediate forwarding):
- Contains: "critical", "urgent", "emergency", "stat"
- Action: Create high-priority Notion page

**Standard Messages** (normal forwarding):
- All other messages
- Action: Create standard Notion page

### **Option 2: Time-Based Forwarding**
Only forward during business hours:
```
and(
  greater(int(formatDateTime(utcNow(), 'HH')), 6),
  less(int(formatDateTime(utcNow(), 'HH')), 19)
)
```

### **Option 3: User-Based Filtering**
Only forward messages from specific users:
```
or(
  equals(triggerOutputs()?['body/from/user/displayName'], 'Dr. Smith'),
  equals(triggerOutputs()?['body/from/user/displayName'], 'Lab Manager'),
  contains(triggerOutputs()?['body/from/user/displayName'], 'Supervisor')
)
```

## 📊 **What Gets Created in Notion**

Every forwarded message creates a Notion page with:
- **Incident ID**: TEAMS-YYYYMMDD-HHMMSS
- **Original Message**: Full Teams message content
- **Reporter**: Teams message sender
- **Channel**: Lab Alerts (confirmed)
- **Timestamp**: When message was posted
- **Link**: Direct link back to Teams message
- **Status**: Open (for follow-up)
- **Type**: "Lab Alert Forward"

## 🧪 **Testing Your Setup**

### **Test Messages to Post in Lab Alerts Channel**:
1. "Patient sample requires immediate attention in room 3"
2. "Equipment malfunction on analyzer #2"  
3. "Lab results ready for Dr. Johnson - critical values detected"
4. "Shift change notes: pending tests in queue"

### **Expected Flow**:
1. Message posted to Lab Alerts Channel
2. Power Automate flow triggers immediately
3. HTTP POST sent to your webhook
4. Notion incident page created
5. Optional: Confirmation message posted back to channel

## 🔧 **Webhook Configuration**

Your webhook at `/webhook/teams-to-notion` already handles this perfectly. It will:
- ✅ Accept any message from Lab Alerts Channel
- ✅ Create detailed Notion incident page
- ✅ Extract all metadata (sender, timestamp, link)
- ✅ Auto-classify severity if keywords found
- ✅ Log all activity for audit trail

## 📋 **Quick Setup Checklist**

- [ ] Create Power Automate flow
- [ ] Set trigger to Lab Alerts Channel only
- [ ] Configure HTTP POST with webhook URL
- [ ] Use provided JSON body template
- [ ] Test with sample message
- [ ] Verify Notion page creation
- [ ] Enable flow and monitor

## 🎯 **Result**

Every message in your Lab Alerts Channel will automatically create a corresponding incident page in Notion with full context and tracking capabilities!