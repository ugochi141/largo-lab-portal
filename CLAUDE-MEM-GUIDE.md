# 🧠 claude-mem - Memory System for Largo Laboratory Portal

**Persistent Memory & Knowledge Management for Claude**

---

## 📋 Overview

**claude-mem** (v3.9.16) is a memory compression system that allows Claude to remember context, build knowledge graphs, and recall information across sessions.

**Added:** November 3, 2025
**Status:** ✅ Active
**Configuration:** ~/.config/claude-desktop/config.json

---

## 🎯 What claude-mem Does

### Core Features

1. **Persistent Memory**
   - Remembers conversations across sessions
   - Builds cumulative knowledge over time
   - No need to repeat information

2. **Knowledge Graphs**
   - Creates connections between related information
   - Organizes data hierarchically
   - Enables smart retrieval

3. **Memory Compression**
   - Efficiently stores large amounts of context
   - Optimizes for quick recall
   - Reduces token usage

4. **Transcript Management**
   - Maintains conversation history
   - Allows searching past interactions
   - Tracks project evolution

---

## 💡 Use Cases for Largo Laboratory

### Equipment Management

**Store:**
```
Remember that the Sysmex XN-2000 hematology analyzer:
- Serial Number: XN20-12345
- Last calibrated: November 1, 2025
- Calibration due: December 1, 2025
- Service contact: Sysmex Support 800-428-4315
- Maintenance performed by: John Smith, Lead Tech
```

**Recall:**
```
When is the Sysmex XN-2000 calibration due?
Who performed the last maintenance on the XN-2000?
What's the service contact for the Sysmex analyzer?
```

### Staff Information

**Store:**
```
Remember these inventory contacts:
- Alex Roberson: Chemistry supplies, LargoInventoryTeam@KP.org
- Erick Albarracin: Hematology reagents, LargoInventoryTeam@KP.org
- Daniel Vanzego: Backup inventory, LargoInventoryTeam@KP.org
```

**Recall:**
```
Who should I contact for chemistry supplies?
What's the email for inventory team?
```

### Standard Operating Procedures

**Store:**
```
Remember the daily lab startup procedure:
1. 7:00 AM - Equipment power-on and warm-up
2. 7:15 AM - QC material preparation
3. 7:30 AM - Run daily QC on all analyzers
4. 7:45 AM - Review and approve QC results
5. 8:00 AM - Begin patient testing
```

**Recall:**
```
What's the daily startup procedure?
What time should QC be run?
```

### Quality Control

**Store:**
```
Remember Levy-Jennings rules for QC:
- 1-2s: Warning - check next run
- 1-3s: Reject - investigate and recalibrate
- 2-2s: Reject - systematic error, recalibrate
- R-4s: Reject - random error, check reagents
- 4-1s: Reject - shift detected
- 10x: Reject - trend detected
```

**Recall:**
```
What does a 1-3s Levy-Jennings violation mean?
What should I do if I see an R-4s violation?
```

### Vendor Information

**Store:**
```
Remember these vendor contacts:
- Beckman Coulter: 800-526-3821 (Chemistry analyzers)
- Sysmex: 800-428-4315 (Hematology analyzers)
- Siemens: 800-431-1146 (Urinalysis analyzers)
- Bio-Rad: 800-424-6723 (QC materials)
- Fisher Scientific: 800-766-7000 (General supplies)
```

**Recall:**
```
What's the phone number for Beckman Coulter support?
Who do I call for QC materials?
```

---

## 🚀 Getting Started

### Basic Commands

#### Store Information
```
Remember that [information]
Store this: [information]
Keep this in memory: [information]
```

#### Recall Information
```
What do you remember about [topic]?
Recall [topic]
What did I tell you about [topic]?
```

#### Update Information
```
Update memory: [old info] should now be [new info]
Forget [information]
Replace [old] with [new]
```

#### Query Memory
```
What do you know about [topic]?
Show me everything about [topic]
Search your memory for [topic]
```

---

## 📊 Laboratory-Specific Examples

### Example 1: Equipment Tracking

**Session 1 (Store):**
```
Remember the following equipment for the Largo Laboratory:

Chemistry Department:
- Beckman AU5800 (SN: AU58-67890) - Last PM: Oct 15, 2025, Next PM: Jan 15, 2026
- Roche Cobas 8000 (SN: CB8K-11223) - Last PM: Oct 20, 2025, Next PM: Jan 20, 2026

Hematology Department:
- Sysmex XN-2000 (SN: XN20-12345) - Last PM: Nov 1, 2025, Next PM: Feb 1, 2026
- Sysmex XN-1000 (SN: XN10-54321) - Last PM: Oct 25, 2025, Next PM: Jan 25, 2026

All preventive maintenance is quarterly (every 90 days).
```

**Session 2 (Recall):**
```
When is the next PM due for the Beckman AU5800?
→ January 15, 2026

Which analyzers need PM in January?
→ Beckman AU5800 (Jan 15), Roche Cobas 8000 (Jan 20), Sysmex XN-1000 (Jan 25)

What's the serial number of the Sysmex XN-2000?
→ XN20-12345
```

### Example 2: Inventory Management

**Session 1 (Store):**
```
Remember the PAR levels for chemistry reagents:

High-Volume Tests (reorder at 50% PAR):
- BMP reagent: PAR 10 kits, reorder at 5 kits
- CBC reagent: PAR 15 kits, reorder at 7 kits
- Lipid panel: PAR 8 kits, reorder at 4 kits

Medium-Volume Tests (reorder at 30% PAR):
- Thyroid panel: PAR 5 kits, reorder at 2 kits
- Cardiac markers: PAR 6 kits, reorder at 2 kits

All orders go through LargoInventoryTeam@KP.org with GL code 1808-18801-5693.
```

**Session 2 (Recall):**
```
What's the PAR level for BMP reagent?
→ PAR 10 kits, reorder at 5 kits

When should I reorder thyroid panels?
→ When stock reaches 2 kits (30% of PAR level of 5)

What email do I use for inventory orders?
→ LargoInventoryTeam@KP.org
```

### Example 3: Training Records

**Session 1 (Store):**
```
Remember staff training for SBAR communication:

Completed Training (Nov 1, 2025):
- John Smith (Lead Tech) - Score: 95%
- Sarah Johnson (MLT) - Score: 92%
- Michael Chen (MLS) - Score: 98%

Scheduled Training (Nov 15, 2025):
- Emily Davis (new hire)
- Robert Martinez (transfer from Microbiology)

Training materials located at: largo-lab-portal/sbar-implementation-guide.html
Trainer: Laboratory Manager
Duration: 2 hours
Assessment: 10-question quiz (passing: 80%)
```

**Session 2 (Recall):**
```
Who completed SBAR training?
→ John Smith (95%), Sarah Johnson (92%), Michael Chen (98%)

When is the next SBAR training session?
→ November 15, 2025

Where are the training materials?
→ largo-lab-portal/sbar-implementation-guide.html
```

---

## 🔧 Advanced Features

### Building Knowledge Graphs

claude-mem automatically creates connections between related information:

**Store Related Information:**
```
Remember:
- The Beckman AU5800 uses Bio-Rad Lyphochek Chemistry Controls
- Bio-Rad controls have 30-day stability after opening
- Beckman AU5800 requires 3 levels of QC daily (Level 1, 2, 3)
- QC must be run before patient testing begins at 8 AM
```

**Query Connections:**
```
What controls does the Beckman AU5800 use?
→ Bio-Rad Lyphochek Chemistry Controls

How long are those controls stable?
→ 30 days after opening

What QC schedule does the Beckman require?
→ 3 levels daily before 8 AM patient testing
```

### Memory Compression

For large amounts of information, claude-mem compresses data efficiently:

**Store Entire Procedures:**
```
Remember the complete Beckman AU5800 calibration procedure:
[Paste entire SOP - multiple pages]
```

**Quick Recall:**
```
What's step 5 of the Beckman AU5800 calibration?
→ [Returns specific step without loading entire document]
```

---

## 📈 Best Practices

### DO:

✅ **Be Specific**
```
Remember that the Sysmex XN-2000 (serial XN20-12345) was calibrated on Nov 1, 2025
```

✅ **Include Context**
```
Remember for the Chemistry department: BMP PAR level is 10 kits
```

✅ **Update When Changed**
```
Update: The Beckman AU5800 was recalibrated today (Nov 3, 2025)
```

✅ **Use Consistent Naming**
```
Always refer to "Sysmex XN-2000" (not "the hematology analyzer" or "XN2000")
```

### DON'T:

❌ **Be Vague**
```
Remember the analyzer was calibrated
```

❌ **Store Temporary Information**
```
Remember I'm working on the QC report right now
```

❌ **Duplicate Information**
```
Store the same information multiple times with different wording
```

---

## 🔄 Memory Management

### View Stored Memories
```
What do you remember about [topic]?
Show me all stored information about [department/equipment/staff]
```

### Update Memories
```
Update: [old information] is now [new information]
The [item] has changed from [old] to [new]
```

### Clear Memories
```
Forget everything about [topic]
Clear memory of [item]
Remove [information] from memory
```

---

## 🆘 Troubleshooting

### Memory Not Persisting

**Problem:** Information isn't remembered across sessions

**Solutions:**
1. Ensure Claude Desktop was restarted after adding claude-mem
2. Check MCP configuration: `cat ~/.config/claude-desktop/config.json`
3. Verify claude-mem is listed in `mcpServers`
4. Look for MCP connection errors in Claude Desktop

### Memory Recall Issues

**Problem:** Can't recall stored information

**Solutions:**
1. Use more specific queries: "What's the serial number of the Sysmex XN-2000?" instead of "What's the serial number?"
2. Include context: "In the Chemistry department, what's the PAR level for BMP reagent?"
3. Check if information was stored: "What do you remember about [topic]?"

### Conflicting Information

**Problem:** Multiple versions of the same information stored

**Solutions:**
1. Update existing memory instead of adding new: "Update: [old] is now [new]"
2. Clear old information first: "Forget the old calibration date, the new date is..."
3. Be explicit: "Replace the previous contact with this new contact"

---

## 🔗 Integration with Largo Lab Portal

### Equipment Tracker Integration
- Store equipment details in claude-mem
- Quick recall during maintenance
- Track service history across sessions

### Inventory System Integration
- Remember PAR levels and reorder points
- Store vendor contacts
- Track order history

### SBAR Communication
- Store common scenarios and responses
- Remember staff training status
- Quick access to communication templates

### Manager Dashboard
- Store daily task lists
- Remember staffing schedules
- Track ongoing projects

---

## 📞 Support & Resources

### Configuration File
```
~/.config/claude-desktop/config.json
```

### Documentation
- MCP Setup Guide: `/Users/ugochindubuisi1/largo-lab-portal/MCP-SETUP.md`
- This Guide: `/Users/ugochindubuisi1/largo-lab-portal/CLAUDE-MEM-GUIDE.md`

### Package Information
- **Package:** claude-mem
- **Version:** 3.9.16
- **Maintainer:** thedotmack
- **NPM:** https://npm.im/claude-mem

### Verification
```bash
# Check if claude-mem is configured
cat ~/.config/claude-desktop/config.json | grep "claude-mem"

# Test in Claude Desktop
"Remember that this is a test message"
"What did I just ask you to remember?"
```

---

## 💡 Pro Tips

1. **Start Each Session with Context**
   ```
   Remember: We're working on the Largo Laboratory Portal project for
   Kaiser Permanente. I'm the lab manager managing equipment, inventory,
   and staff training.
   ```

2. **Store Reference Information Early**
   ```
   Remember these key contacts and resources for quick reference throughout
   our sessions...
   ```

3. **Use Hierarchical Storage**
   ```
   Remember for Chemistry Department > Equipment > Beckman AU5800 >
   Calibration: Last performed Nov 1, 2025
   ```

4. **Combine with TaskMaster AI**
   ```
   Use TaskMaster to create a maintenance plan, then remember that plan
   for future reference
   ```

---

**Last Updated:** November 3, 2025
**Status:** ✅ Active and Configured
**Portal Version:** 3.0
**Integration:** Full MCP support with TaskMaster AI

---

🎯 **Ready to Use!** Start storing laboratory information and building your institutional knowledge base!
