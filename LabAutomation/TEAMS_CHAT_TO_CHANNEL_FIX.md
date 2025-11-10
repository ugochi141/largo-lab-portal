# 🔧 Fix: Teams Chat Keywords → Lab Alerts Channel → Notion

## 🎯 **Your Current Issue**

Keywords from Teams Chat are not flowing through to Lab Alerts Channel and then to Notion. This is likely a Power Automate configuration issue.

## 🚨 **Problem Analysis**

You have TWO separate Power Automate flows that need to work together:

### **Flow 1: Teams Chat → Lab Alerts Channel**
- **Trigger**: When message posted in Teams Chat
- **Condition**: Check for keywords (critical, urgent, lab, patient, etc.)
- **Action**: Post alert message to Lab Alerts Channel

### **Flow 2: Lab Alerts Channel → Notion**  
- **Trigger**: When message posted in Lab Alerts Channel
- **Action**: Send to webhook → Create Notion page

## ✅ **Step-by-Step Fix**

### **Step 1: Fix Flow 1 (Teams Chat → Lab Alerts Channel)**

#### **Create New Flow for Chat Monitoring**:
1. Go to: https://make.powerautomate.com
2. **Create** → **Automated cloud flow**
3. **Name**: "Teams Chat Keywords to Lab Alerts"

#### **Configure Trigger**:
- **Trigger**: "When a new chat message is added"
- **Team**: Select your Kaiser Permanente team
- **Chat**: Select "Any chat" or specific chats to monitor

#### **Add Condition for Keywords**:
```
contains(toLower(triggerOutputs()?['body/body/plainTextContent']), 'critical') or
contains(toLower(triggerOutputs()?['body/body/plainTextContent']), 'urgent') or
contains(toLower(triggerOutputs()?['body/body/plainTextContent']), 'lab') or
contains(toLower(triggerOutputs()?['body/body/plainTextContent']), 'patient') or
contains(toLower(triggerOutputs()?['body/body/plainTextContent']), 'incident') or
contains(toLower(triggerOutputs()?['body/body/plainTextContent']), 'alert') or
contains(toLower(triggerOutputs()?['body/body/plainTextContent']), 'emergency') or
contains(toLower(triggerOutputs()?['body/body/plainTextContent']), 'error')
```

#### **Yes Branch - Post to Lab Alerts Channel**:
**Action**: "Post message in a chat or channel"
- **Team**: Kaiser Permanente team
- **Channel**: **Lab Alerts Channel**
- **Message**:
```
🚨 **KEYWORD DETECTED IN TEAMS CHAT** 🚨

**Original Message**: @{triggerOutputs()?['body/body/plainTextContent']}

**From**: @{triggerOutputs()?['body/from/user/displayName']}
**Chat**: @{triggerOutputs()?['body/chatId']}
**Time**: @{utcNow()}
**Message ID**: @{triggerOutputs()?['body/id']}

🔄 **This message will now trigger Notion incident creation**

---
*Auto-forwarded from Teams Chat keyword monitoring*
```

### **Step 2: Fix Flow 2 (Lab Alerts Channel → Notion)**

#### **Update Existing Flow**:
- **Trigger**: "When a new channel message is added"
- **Team**: Kaiser Permanente team  
- **Channel**: **Lab Alerts Channel ONLY**

#### **Remove Keyword Condition**:
Since Flow 1 already filters for keywords, Flow 2 should forward ALL messages from Lab Alerts Channel to Notion.

#### **Fix HTTP Call to Webhook**:
**Method**: POST
**URI**: `https://your-railway-app.railway.app/webhook/teams-to-notion`
**Body**:
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
  "messageId": "@{triggerOutputs()?['body/id']}",
  "timestamp": "@{utcNow()}",
  "webUrl": "@{triggerOutputs()?['body/webUrl']}",
  "forwardAll": true,
  "source": "lab_alerts_channel"
}
```

## 🧪 **Test Your Fixed Flows**

### **Test Flow 1** (Chat → Channel):
1. Send Teams chat message: `"Critical lab incident in room 3"`
2. Check Lab Alerts Channel for auto-posted message
3. Message should appear with keyword detection notice

### **Test Flow 2** (Channel → Notion):
1. Any message in Lab Alerts Channel should trigger webhook
2. Check webhook logs for successful calls
3. Verify Notion incident page creation

### **End-to-End Test**:
1. **Teams Chat**: `"Urgent: Patient sample contamination detected"`
2. **Expected Flow**:
   - Flow 1 detects "urgent" and "patient" keywords
   - Flow 1 posts alert to Lab Alerts Channel
   - Flow 2 detects new message in Lab Alerts Channel  
   - Flow 2 sends to webhook → Creates Notion page

## 🔍 **Debugging Steps**

### **If Flow 1 Isn't Working**:
1. Check Flow 1 run history
2. Verify trigger is set to "chat message" not "channel message"
3. Test condition with simple keyword like "test"
4. Check if you have permissions to post to Lab Alerts Channel

### **If Flow 2 Isn't Working**:
1. Check webhook endpoint is accessible
2. Test webhook directly with curl/Postman
3. Verify dynamic content expressions resolve properly
4. Check Notion API credentials in webhook environment

### **Check Dynamic Content Issues**:
If you see `{Message ID}` instead of actual values:
1. Delete current dynamic content
2. Use **Dynamic content picker** instead of typing expressions
3. Select from "When a new channel message is added" trigger outputs

## 📊 **Expected Results**

**Before Fix**:
- Teams chat keywords ignored
- No connection between chat and channel
- Sporadic Notion page creation

**After Fix**:
- ✅ Teams chat keywords detected automatically
- ✅ Alert posted to Lab Alerts Channel
- ✅ Channel message triggers Notion page creation
- ✅ Full audit trail from chat → channel → Notion

## 🎯 **Alternative: Single Flow Approach**

If two flows are too complex, create ONE flow:

### **Single Flow: Teams Chat → Notion Direct**
- **Trigger**: When chat message added
- **Condition**: Contains keywords
- **Action 1**: Post to Lab Alerts Channel (for visibility)
- **Action 2**: HTTP call to webhook (for Notion)

This ensures every keyword detection goes directly to both places.

## 🔧 **Quick Fix Checklist**

- [ ] Create/update Flow 1 for chat monitoring
- [ ] Fix keyword condition with proper expressions
- [ ] Update Flow 2 to forward all Lab Alerts Channel messages
- [ ] Remove duplicate keyword filtering in Flow 2
- [ ] Test with simple keyword message
- [ ] Verify webhook receives proper data
- [ ] Check Notion page creation works
- [ ] Document the working configuration

Your flows should now properly detect keywords in Teams Chat and create corresponding Notion incident pages!