# 🔧 Power Automate Troubleshooting: Fix Dynamic Content Issues

## ❌ **Current Issue**

Your flow is working (detecting keywords and posting alerts) but showing:
```
🚨 Keyword Alert!
**Conversation:** {Conversation ID}
**Message:** {Message ID} 
**Link:** {Link to message}
**Original Message Content:** {Message ID}
```

**Problem**: Dynamic content expressions aren't resolving to actual values.

## ✅ **Solution: Fix Dynamic Content**

### **Step 1: Check Your Trigger**
Make sure you're using the correct trigger:
- **Trigger**: "When a new channel message is added"
- **NOT**: "When a message is received in a chat"

### **Step 2: Fix Message Content in Teams Post**
Replace your current message with **proper Power Automate expressions**:

```
🚨 **LAB KEYWORD ALERT** 🚨

**Original Message**: @{triggerOutputs()?['body/body/plainTextContent']}

**Details**:
• **Sender**: @{triggerOutputs()?['body/from/user/displayName']}
• **Channel**: @{triggerOutputs()?['body/channelIdentity/displayName']}
• **Time**: @{utcNow()}
• **Message ID**: @{triggerOutputs()?['body/id']}

**Link to Message**: @{triggerOutputs()?['body/webUrl']}

✅ **Notion incident page will be created automatically**
```

### **Step 3: Update HTTP Call to Webhook**
Fix your HTTP POST body:

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
  "powerAutomate": true
}
```

## 🛠 **Alternative: Use Dynamic Content Selector**

Instead of typing expressions, **use the Dynamic Content picker**:

### **In Teams Message**:
1. Click in message field
2. Click **Dynamic content** 
3. Look for these fields from "When a new channel message is added":
   - **Message body** (for message content)
   - **User display name** (for sender)
   - **Channel display name** (for channel)
   - **Message id** (for ID)
   - **Message link** (for URL)

### **Correct Dynamic Content Names**:
- ✅ `Message body` → Original message text
- ✅ `User display name` → Sender name  
- ✅ `Channel display name` → Channel name
- ✅ `Message link` → Direct link to message
- ✅ `Message id` → Unique message identifier

## 🧪 **Test Your Fixed Flow**

### **Test Message Template** (corrected):
```
🚨 **LAB KEYWORD ALERT** 🚨

**Message**: [Dynamic: Message body]
**Sender**: [Dynamic: User display name]  
**Channel**: [Dynamic: Channel display name]
**Time**: [Dynamic: Created time]
**Link**: [Dynamic: Message link]

🔗 **View Full Message**: [Dynamic: Message link]
📝 **Notion Page**: Creating incident automatically...
```

### **Test the Flow**:
1. Post message: `"Critical lab incident in room 3"`
2. Check Teams channel for properly formatted alert
3. Verify webhook receives correct data
4. Confirm Notion page is created

## 🚀 **Enhanced Message Template**

For a professional look:

```
🔴 **CRITICAL LAB ALERT** 🔴

📱 **Message**: [Dynamic: Message body]

👤 **Reporter**: [Dynamic: User display name]
📍 **Location**: [Dynamic: Channel display name]  
🕐 **Time**: [Dynamic: Created time]
🔗 **Link**: [Click here to view original message]

**Automated Actions**:
✅ Alert posted to monitoring channel
✅ Notion incident page created  
✅ Notification sent to lab supervisors

**Next Steps**:
1. Click link above to view full context
2. Check Notion for incident tracking
3. Respond in original thread with updates
```

## 🔍 **Debug Steps**

If dynamic content still isn't working:

### **1. Check Flow History**
- Go to **Power Automate** → **My flows**
- Click your flow → **Run history**
- Click a recent run → **Check each step**

### **2. Verify Trigger Output**
- In flow history, click the trigger step
- Look at **Outputs** section  
- Find the correct property paths

### **3. Test Expressions**
Add a **Compose** action to test expressions:
- Action: **Compose**
- Inputs: `@{triggerOutputs()?['body/body/plainTextContent']}`
- Run flow and check output

## ⚡ **Quick Fix Steps**

1. **Edit your flow**
2. **Click on the Teams "Post message" action**
3. **Clear the message field**
4. **Use Dynamic content picker** (don't type expressions manually)
5. **Select**: Message body, User display name, Channel display name
6. **Save and test**

## 📊 **Expected Results After Fix**

**Before** (broken):
```
Message: {Message ID}
Sender: {Conversation ID}
```

**After** (working):
```
Message: Critical lab incident in room 3  
Sender: Dr. Sarah Johnson
Channel: Lab Operations
Time: 2025-09-10T18:35:00Z
```

Your webhook will then receive proper data and create detailed Notion pages!