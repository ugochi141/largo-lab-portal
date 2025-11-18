# 🤖 TaskMaster AI - MCP Server Setup Guide

**Model Context Protocol (MCP) Integration for Largo Laboratory Portal**

This guide will help you set up the TaskMaster AI MCP server to enhance Claude Desktop with advanced task management capabilities.

---

## 📋 Table of Contents

1. [What is TaskMaster AI?](#what-is-taskmaster-ai)
2. [Prerequisites](#prerequisites)
3. [Security Best Practices](#security-best-practices)
4. [Installation Steps](#installation-steps)
5. [Configuration](#configuration)
6. [Usage Examples](#usage-examples)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 What is TaskMaster AI?

TaskMaster AI is an MCP (Model Context Protocol) server that adds powerful task management features to Claude Desktop:

- **Automated Task Breakdown** - Breaks complex projects into manageable subtasks
- **Priority Management** - Intelligently prioritizes tasks based on urgency and dependencies
- **Research Integration** - Uses Perplexity AI for real-time research and information gathering
- **Context Awareness** - Maintains context across multiple tasks and projects
- **Progress Tracking** - Monitors task completion and provides status updates

**Perfect for:**
- Laboratory operations management
- Equipment maintenance scheduling
- Inventory management planning
- Staff training coordination
- Quality control task tracking

---

## ✅ Prerequisites

Before setting up TaskMaster AI, ensure you have:

### Required
- ✅ **Claude Desktop** installed and updated
- ✅ **Node.js** v18+ (already installed: v25.1.0 ✅)
- ✅ **NPM** v9+ (already installed: 11.6.2 ✅)
- ✅ **Anthropic API Key** (create at https://console.anthropic.com/settings/keys)

### Optional but Recommended
- ⭐ **Perplexity API Key** (for enhanced research features at https://www.perplexity.ai/settings/api)

---

## 🔒 Security Best Practices

**⚠️ CRITICAL: NEVER commit API keys to version control!**

### What We've Already Done
✅ Added `.env` to `.gitignore`
✅ Created `.env.example` template
✅ Configured MCP server to use environment variables

### Your Responsibilities
- 🔐 **Keep API keys private** - Never share in chat, email, or commits
- 🔄 **Rotate keys regularly** - Change keys every 90 days
- 👀 **Monitor usage** - Check API usage dashboards for unusual activity
- 🗑️ **Revoke compromised keys immediately** - If exposed, revoke and regenerate

### If a Key is Exposed
1. **Revoke immediately** at https://console.anthropic.com/settings/keys
2. **Generate new key**
3. **Update .env file** with new key
4. **Restart Claude Desktop**
5. **Review API usage logs** for unauthorized charges

---

## 📦 Installation Steps

### Step 1: Set Up Environment Variables

**Option A: System-Wide (Recommended)**

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# Open your shell configuration file
nano ~/.zshrc

# Add these lines at the end
export ANTHROPIC_API_KEY="sk-ant-api03-YOUR_NEW_KEY_HERE"
export PERPLEXITY_API_KEY="pplx-YOUR_KEY_HERE"  # Optional

# Save and reload
source ~/.zshrc
```

**Option B: Project-Specific**

```bash
# Copy the example file
cd /Users/ugochindubuisi1/largo-lab-portal
cp .env.example .env

# Edit .env and add your real keys
nano .env

# Add:
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_NEW_KEY_HERE
PERPLEXITY_API_KEY=pplx-YOUR_KEY_HERE
```

### Step 2: Verify MCP Configuration

The MCP server configuration has already been created at:
```
~/.config/claude-desktop/config.json
```

**Configuration Details:**
```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}",
        "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}",
        "MODEL": "claude-3-7-sonnet-20250219",
        "PERPLEXITY_MODEL": "sonar-pro",
        "MAX_TOKENS": "64000",
        "TEMPERATURE": "0.2",
        "DEFAULT_SUBTASKS": "5",
        "DEFAULT_PRIORITY": "medium"
      }
    }
  }
}
```

### Step 3: Restart Claude Desktop

**Important:** You MUST restart Claude Desktop for MCP changes to take effect.

```bash
# Quit Claude Desktop completely
# Then relaunch it
```

### Step 4: Verify Installation

After restarting Claude Desktop:

1. Look for a **"MCP"** or **"Servers"** indicator in the UI
2. Check that "taskmaster-ai" appears in the servers list
3. Try a test command: "Use TaskMaster to create a task for inventory management"

---

## ⚙️ Configuration

### Model Settings

The configuration uses optimized settings for laboratory operations:

| Setting | Value | Purpose |
|---------|-------|---------|
| **MODEL** | claude-3-7-sonnet-20250219 | Latest Claude Sonnet for task processing |
| **MAX_TOKENS** | 64000 | Allows detailed task breakdowns |
| **TEMPERATURE** | 0.2 | Low temperature for consistent, predictable output |
| **DEFAULT_SUBTASKS** | 5 | Default number of subtasks per task |
| **DEFAULT_PRIORITY** | medium | Default priority level for new tasks |

### Customization Options

**To adjust settings, edit** `~/.config/claude-desktop/config.json`:

**Higher Detail (more subtasks):**
```json
"DEFAULT_SUBTASKS": "10"
```

**More Creative Responses:**
```json
"TEMPERATURE": "0.7"
```

**Different Model:**
```json
"MODEL": "claude-opus-4-20250514"  // More powerful, higher cost
```

**After changes:** Restart Claude Desktop

---

## 🚀 Usage Examples

### Example 1: Equipment Maintenance Planning

**Prompt:**
```
Use TaskMaster to create a comprehensive maintenance plan for the Sysmex XN-2000 hematology analyzer for Q1 2026.
```

**TaskMaster will:**
1. Break down maintenance into weekly, monthly, quarterly tasks
2. Prioritize based on equipment criticality
3. Research manufacturer recommendations (if Perplexity enabled)
4. Create checklist with specific dates
5. Assign priority levels (critical, high, medium, low)

### Example 2: Inventory Reordering Workflow

**Prompt:**
```
Create a task workflow for automated inventory reordering when PAR levels fall below 30%.
```

**TaskMaster will:**
1. Design the workflow steps
2. Identify required data points (item, current stock, PAR level, vendor)
3. Create email template tasks
4. Set up monitoring schedule
5. Define escalation procedures

### Example 3: Staff Training Schedule

**Prompt:**
```
Plan a training schedule for onboarding 3 new Medical Laboratory Scientists over the next 90 days.
```

**TaskMaster will:**
1. Break down training into competency areas
2. Create week-by-week schedule
3. Assign trainers and checkpoints
4. Include compliance requirements (CLIA, CAP, HIPAA)
5. Set evaluation milestones

### Example 4: QC/Maintenance Calendar

**Prompt:**
```
Generate tasks for all QC and maintenance activities for November 2025 based on our existing schedule.
```

**TaskMaster will:**
1. Parse existing QC schedules
2. Create individual tasks for each activity
3. Set reminders and due dates
4. Organize by equipment/category
5. Include documentation requirements

---

## 🔧 Troubleshooting

### Issue: MCP Server Not Showing in Claude Desktop

**Solution:**
1. Check that `~/.config/claude-desktop/config.json` exists
2. Verify JSON syntax is valid (no trailing commas, proper quotes)
3. Ensure environment variables are set: `echo $ANTHROPIC_API_KEY`
4. Restart Claude Desktop completely (quit and relaunch)
5. Check Claude Desktop logs: `~/Library/Logs/Claude/`

### Issue: "Invalid API Key" Error

**Solution:**
1. Verify API key is active at https://console.anthropic.com/settings/keys
2. Check environment variable is set: `echo $ANTHROPIC_API_KEY`
3. Ensure no extra spaces or quotes around the key
4. Try regenerating the API key
5. Reload shell config: `source ~/.zshrc`

### Issue: TaskMaster Commands Not Working

**Solution:**
1. Verify the MCP server is running: Look for "taskmaster-ai" in Claude Desktop UI
2. Check Node.js version: `node --version` (should be v18+)
3. Try installing the package manually: `npm install -g task-master-ai`
4. Check npm global path: `npm config get prefix`
5. Review Claude Desktop logs for error messages

### Issue: Slow Response Times

**Solution:**
1. Reduce `MAX_TOKENS` to 32000 for faster responses
2. Lower `DEFAULT_SUBTASKS` to 3
3. Check internet connection
4. Verify API rate limits haven't been exceeded
5. Consider using Claude Sonnet instead of Opus for speed

### Issue: Tasks Missing Context

**Solution:**
1. Increase `MAX_TOKENS` to allow more context
2. Be more specific in task descriptions
3. Reference relevant files or data sources
4. Use multi-step prompts for complex tasks
5. Enable Perplexity integration for research

---

## 📊 Cost Management

### API Usage Estimates

**Anthropic Claude 3.7 Sonnet:**
- Input: ~$3.00 per million tokens
- Output: ~$15.00 per million tokens

**Typical Task Breakdown:**
- Simple task: ~2,000 tokens (~$0.03)
- Medium task: ~10,000 tokens (~$0.15)
- Complex project: ~50,000 tokens (~$0.75)

**Monthly Estimate for Largo Lab:**
- ~50 tasks/month × $0.15 avg = **~$7.50/month**

**Perplexity Sonar Pro (Optional):**
- ~$0.005 per research query
- ~10 queries/month = **~$0.05/month**

**Total Estimated Cost: ~$8/month**

### Cost Reduction Tips
1. Use lower `MAX_TOKENS` for simple tasks
2. Batch related tasks together
3. Use Claude Haiku for simpler operations
4. Cache frequently used contexts
5. Monitor usage dashboard regularly

---

## 🎓 Best Practices for Laboratory Use

### 1. Task Naming Convention
```
[Category] - [Equipment/Area] - [Action]
Examples:
- QC - Sysmex XN-2000 - Daily Startup
- Inventory - Chemistry Reagents - Reorder
- Training - New Hire - Competency Assessment
- Maintenance - Water System - Monthly Filter Change
```

### 2. Priority Levels
- **Critical:** Patient safety, regulatory compliance
- **High:** Equipment maintenance, critical inventory
- **Medium:** Staff training, routine QC
- **Low:** Documentation updates, general improvements

### 3. Subtask Organization
- Break down by competency area, not time
- Include acceptance criteria
- Assign specific staff when possible
- Reference SOPs and policies
- Set realistic deadlines

### 4. Integration with Portal
- Use TaskMaster to plan features
- Generate tasks for manager dashboard
- Create maintenance schedules for equipment tracker
- Plan inventory reorder workflows
- Design staff training curricula

---

## 📞 Support Resources

### Anthropic Claude
- **Documentation:** https://docs.anthropic.com
- **API Console:** https://console.anthropic.com
- **Support:** support@anthropic.com
- **Status Page:** https://status.anthropic.com

### TaskMaster AI
- **NPM Package:** https://www.npmjs.com/package/task-master-ai
- **Issues:** Report on the package repository

### Largo Lab Portal
- **Portal URL:** http://localhost:3000/largo-lab-portal/
- **Manager Dashboard:** manager-dashboard.html
- **GitHub:** https://github.com/ugochi141/largo-lab-portal

---

## ✅ Quick Reference

### Environment Variable Locations
```bash
# System-wide (recommended)
~/.zshrc or ~/.bashrc

# Project-specific
/Users/ugochindubuisi1/largo-lab-portal/.env
```

### Configuration File
```bash
~/.config/claude-desktop/config.json
```

### Commands
```bash
# Verify environment variables
echo $ANTHROPIC_API_KEY

# Reload shell config
source ~/.zshrc

# Check Node.js version
node --version

# Check npm version
npm --version

# View Claude Desktop logs
tail -f ~/Library/Logs/Claude/main.log
```

### Emergency Procedures
1. **Key Exposed:** Revoke at https://console.anthropic.com/settings/keys
2. **High Costs:** Check usage at https://console.anthropic.com/settings/billing
3. **MCP Not Working:** Restart Claude Desktop
4. **Errors:** Check `~/Library/Logs/Claude/`

---

## 🎉 You're All Set!

TaskMaster AI is now configured and ready to enhance your Largo Laboratory Portal experience with intelligent task management.

**Next Steps:**
1. ✅ Add your API keys to environment variables
2. ✅ Restart Claude Desktop
3. ✅ Try the usage examples above
4. ✅ Explore advanced features
5. ✅ Monitor API usage and costs

**For Questions:**
- Check the Troubleshooting section
- Review Claude Desktop documentation
- Contact your system administrator

---

**Document Version:** 1.0
**Last Updated:** November 3, 2025
**Portal Version:** 3.0.0 (100/100 Health)

**GL Code:** 1808-18801-5693
**Largo Laboratory Operations**

---

🤖 **Generated with [Claude Code](https://claude.com/claude-code)**
