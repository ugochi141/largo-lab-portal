#!/usr/bin/env python3
"""
Deploy Lab Inventory Management System
Automates setup and configuration tasks
"""

import os
import shutil
from pathlib import Path
from datetime import datetime
import json

class InventorySystemDeployer:
    def __init__(self):
        self.project_root = Path("/Users/ugochi141/Desktop/LabAutomation")
        self.downloads_path = Path("/Users/ugochi141/Downloads")
        self.deployment_log = []
        
    def log_action(self, action, status="✓"):
        """Log deployment actions"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"{status} [{timestamp}] {action}"
        self.deployment_log.append(log_entry)
        print(log_entry)
    
    def create_directory_structure(self):
        """Create necessary directories"""
        directories = [
            self.project_root / "data" / "inventory",
            self.project_root / "data" / "inventory" / "backups",
            self.project_root / "data" / "inventory" / "reports",
            self.project_root / "config" / "inventory"
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            self.log_action(f"Created directory: {directory}")
    
    def deploy_inventory_files(self):
        """Deploy inventory files to appropriate locations"""
        # Find the template file
        template_file = self.downloads_path / "LARGO_LAB_INVENTORY_TEMPLATE_COMPLETE.xlsx"
        if not template_file.exists():
            template_file = self.project_root / "data" / "LARGO_LAB_INVENTORY_TEMPLATE_COMPLETE.xlsx"
        
        if template_file.exists():
            # Create a working copy
            working_file = self.project_root / "data" / "inventory" / "LARGO_LAB_INVENTORY_CURRENT.xlsx"
            shutil.copy2(template_file, working_file)
            self.log_action(f"Deployed working inventory file: {working_file.name}")
            
            # Create a backup
            backup_file = self.project_root / "data" / "inventory" / "backups" / f"inventory_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            shutil.copy2(template_file, backup_file)
            self.log_action(f"Created backup: {backup_file.name}")
        else:
            self.log_action("Template file not found - run create_inventory_template.py first", "✗")
    
    def create_config_file(self):
        """Create configuration file for inventory system"""
        config = {
            "inventory_settings": {
                "low_stock_threshold": 10,
                "critical_stock_threshold": 5,
                "expiration_warning_days": 60,
                "auto_backup_enabled": True,
                "backup_frequency_days": 7
            },
            "lab_locations": ["MOB", "AUC", "BOTH"],
            "staff_assignments": {
                "inventory_manager_primary": "Lorraine",
                "inventory_manager_secondary": "Ingrid",
                "supply_coordinator": "Nathaniel Burmeister",
                "backup_processors": ["Mimi"]
            },
            "notification_settings": {
                "low_stock_alerts": True,
                "expiration_alerts": True,
                "daily_reminder_time": "07:30",
                "weekly_report_day": "Monday"
            },
            "critical_items": {
                "ALT_reagents": {
                    "current_quantity": 25,
                    "expiration_date": "2025-10-31",
                    "action": "Redistribute to other locations before expiration"
                }
            },
            "known_issues": [
                "Multiple supplier IDs need verification",
                "MEDTOX QC logging in Cerner",
                "Coordinate urine processing between labs"
            ]
        }
        
        config_file = self.project_root / "config" / "inventory" / "inventory_config.json"
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=4)
        
        self.log_action(f"Created configuration file: {config_file.name}")
    
    def create_quick_reference(self):
        """Create a quick reference card for staff"""
        quick_ref = """
# LARGO LAB INVENTORY - QUICK REFERENCE CARD

## Daily Tasks (Every Shift):
1. Check SUMMARY tab for alerts
2. Update HAND COUNT for items used
3. Note any supplier ID discrepancies
4. Save file after updates

## Low Stock (<10 items):
1. Enter quantity needed in REQ QTY
2. Change STATUS to "LOW STOCK"
3. Notify Nathaniel for ordering

## Receiving Supplies:
1. Verify supplier ID matches packing slip
2. Update HAND COUNT
3. Add EXPIRATION DATE for reagents
4. Enter LOT NUMBER

## Emergency Contacts:
- Inventory Issues: Lorraine (primary), Ingrid (backup)
- Supply Orders: Nathaniel Burmeister
- IT Support: Help Desk x1234

## Overflow Procedures:
- MOB overwhelmed → Send to AUC
- Urine processing: Lorraine → Mimi (backup)
- Always communicate via Teams first

## File Location:
Teams > Largo Lab > Files > Inventory > LARGO_LAB_INVENTORY_CURRENT.xlsx

--- Print and post at each workstation ---
"""
        
        quick_ref_file = self.project_root / "data" / "inventory" / "QUICK_REFERENCE_CARD.txt"
        with open(quick_ref_file, 'w') as f:
            f.write(quick_ref)
        
        self.log_action(f"Created quick reference card: {quick_ref_file.name}")
    
    def create_training_checklist(self):
        """Create training checklist for staff"""
        checklist = """
# Inventory System Training Checklist

## Trainee: _________________ Date: _________ Trainer: _________________

### Basic Operations:
- [ ] Open inventory file from Teams
- [ ] Navigate between sheets
- [ ] Update HAND COUNT field
- [ ] Use LOCATION dropdown
- [ ] Save file properly

### Daily Tasks:
- [ ] Review SUMMARY alerts
- [ ] Check assigned section
- [ ] Identify low stock items
- [ ] Enter REQ QTY for orders
- [ ] Add notes for issues

### Receiving Supplies:
- [ ] Verify supplier IDs
- [ ] Update counts
- [ ] Enter expiration dates
- [ ] Record lot numbers
- [ ] Check against packing slip

### Special Procedures:
- [ ] Handle expiring items
- [ ] Coordinate overflow
- [ ] Use backup assignments
- [ ] Report discrepancies
- [ ] Emergency procedures

### System Features:
- [ ] Understand color coding
- [ ] Read status indicators
- [ ] Use formulas correctly
- [ ] Find help resources
- [ ] Contact support

### Completion:
- [ ] Demonstrate one full update cycle
- [ ] Answer knowledge check questions
- [ ] Sign off on training

Trainee Signature: _______________________

Trainer Signature: _______________________
"""
        
        checklist_file = self.project_root / "data" / "inventory" / "TRAINING_CHECKLIST.txt"
        with open(checklist_file, 'w') as f:
            f.write(checklist)
        
        self.log_action(f"Created training checklist: {checklist_file.name}")
    
    def generate_deployment_report(self):
        """Generate deployment report"""
        report = f"""
# Lab Inventory System Deployment Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Deployment Summary:
{chr(10).join(self.deployment_log)}

## Next Steps:
1. Upload LARGO_LAB_INVENTORY_CURRENT.xlsx to Teams/SharePoint
2. Set permissions for all users
3. Print and distribute QUICK_REFERENCE_CARD.txt
4. Schedule training using TRAINING_CHECKLIST.txt
5. Review inventory_config.json settings

## Critical Reminders:
- Address ALT reagent expiration before October 31
- Verify all supplier IDs with packing slips
- Ensure MEDTOX QC is logged in Cerner
- Set up daily reminders for inventory updates

## File Locations:
- Working File: data/inventory/LARGO_LAB_INVENTORY_CURRENT.xlsx
- Configuration: config/inventory/inventory_config.json
- Quick Reference: data/inventory/QUICK_REFERENCE_CARD.txt
- Training Materials: data/inventory/TRAINING_CHECKLIST.txt
- This Report: data/inventory/reports/deployment_report_{datetime.now().strftime('%Y%m%d')}.txt
"""
        
        report_file = self.project_root / "data" / "inventory" / "reports" / f"deployment_report_{datetime.now().strftime('%Y%m%d')}.txt"
        with open(report_file, 'w') as f:
            f.write(report)
        
        self.log_action(f"Generated deployment report: {report_file.name}")
        
        # Also print to console
        print("\n" + "=" * 60)
        print(report)

def main():
    print("🚀 Lab Inventory System Deployment")
    print("=" * 60)
    
    deployer = InventorySystemDeployer()
    
    # Run deployment steps
    deployer.create_directory_structure()
    deployer.deploy_inventory_files()
    deployer.create_config_file()
    deployer.create_quick_reference()
    deployer.create_training_checklist()
    deployer.generate_deployment_report()
    
    print("\n✅ Deployment Complete!")
    print("\n📋 Critical Actions:")
    print("1. Upload files to Teams/SharePoint immediately")
    print("2. Address ALT reagent expiration issue")
    print("3. Schedule staff training this week")
    print("4. Verify supplier IDs before next order")

if __name__ == "__main__":
    main()



