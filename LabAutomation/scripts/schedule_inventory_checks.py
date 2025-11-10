#!/usr/bin/env python3
"""
Scheduled Inventory Check and Email Automation
Can be run via cron job or scheduled task
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import json
import logging
from inventory_email_automation import InventoryEmailAutomation

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('inventory_automation.log'),
        logging.StreamHandler()
    ]
)

class ScheduledInventoryCheck:
    def __init__(self):
        self.config_path = Path("/Users/ugochi141/Desktop/LabAutomation/config/inventory/email_config.json")
        self.inventory_path = Path("/Users/ugochi141/Downloads/LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx")
        
        # Load configuration
        with open(self.config_path, 'r') as f:
            self.config = json.load(f)
    
    def should_run_check(self):
        """Determine if check should run based on schedule"""
        now = datetime.now()
        
        # Check if it's a weekday (Monday-Friday)
        if now.weekday() >= 5:  # Saturday or Sunday
            return False
        
        # Check if it's the scheduled time (within 30 minutes)
        scheduled_time = datetime.strptime(self.config['schedule']['daily_check_time'], '%H:%M').time()
        current_time = now.time()
        
        # Create datetime objects for comparison
        scheduled_dt = datetime.combine(now.date(), scheduled_time)
        current_dt = datetime.combine(now.date(), current_time)
        
        # Check if within 30 minutes of scheduled time
        time_diff = abs((current_dt - scheduled_dt).total_seconds() / 60)
        
        return time_diff <= 30
    
    def run_inventory_check(self):
        """Run the inventory check and send email if needed"""
        logging.info("Starting scheduled inventory check")
        
        # Check if inventory file exists
        if not self.inventory_path.exists():
            # Try alternative path
            self.inventory_path = Path("/Users/ugochi141/Desktop/LabAutomation/data/inventory/LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx")
            
        if not self.inventory_path.exists():
            logging.error(f"Inventory file not found: {self.inventory_path}")
            return
        
        # Initialize automation
        automation = InventoryEmailAutomation(self.inventory_path, self.config_path)
        
        # Check inventory levels
        automation.check_inventory_levels()
        
        logging.info(f"Items needing reorder: {len(automation.items_to_order)}")
        logging.info(f"Critical items: {len(automation.critical_items)}")
        logging.info(f"Expiring items: {len(automation.expiring_items)}")
        
        # Determine if email should be sent
        send_email = False
        
        # Always send if critical items or expiring items
        if automation.critical_items or automation.expiring_items:
            send_email = True
            logging.warning("CRITICAL/EXPIRING items found - email will be sent")
        
        # Send on scheduled day for routine orders
        elif automation.items_to_order and datetime.now().strftime('%A') == self.config['schedule']['weekly_summary_day']:
            send_email = True
            logging.info("Weekly order day - email will be sent")
        
        # Send if auto_send is enabled
        elif automation.items_to_order and self.config['schedule']['auto_send']:
            send_email = True
            logging.info("Auto-send enabled - email will be sent")
        
        if send_email and automation.items_to_order:
            # Send email (production mode if auto_send is True)
            test_mode = not self.config['schedule']['auto_send']
            automation.send_order_email(test_mode=test_mode)
            
            if test_mode:
                logging.info("Test email generated (auto_send is disabled)")
            else:
                logging.info("Order email sent to supply coordinator")
                
            # Update last run time
            self.update_last_run()
        else:
            logging.info("No email sent - inventory levels adequate or not scheduled")
    
    def update_last_run(self):
        """Update the last run timestamp"""
        run_log = {
            "last_run": datetime.now().isoformat(),
            "next_scheduled": (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d %H:%M')
        }
        
        with open("last_inventory_check.json", 'w') as f:
            json.dump(run_log, f, indent=2)
    
    def generate_status_report(self):
        """Generate a status report for the dashboard"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "inventory_file": str(self.inventory_path),
            "email_config": str(self.config_path),
            "auto_send_enabled": self.config['schedule']['auto_send'],
            "next_check": self.config['schedule']['daily_check_time'],
            "weekly_summary_day": self.config['schedule']['weekly_summary_day']
        }
        
        # Check last run
        if Path("last_inventory_check.json").exists():
            with open("last_inventory_check.json", 'r') as f:
                last_run = json.load(f)
            report['last_run'] = last_run.get('last_run', 'Never')
        else:
            report['last_run'] = 'Never'
        
        return report

def setup_cron_job():
    """Generate cron job configuration"""
    script_path = Path(__file__).absolute()
    python_path = sys.executable
    
    cron_config = f"""
# Largo Lab Inventory Check - Runs Monday-Friday at 7:00 AM
0 7 * * 1-5 {python_path} {script_path} >> /Users/ugochi141/Desktop/LabAutomation/logs/inventory_cron.log 2>&1

# Optional: Weekly summary email on Mondays at 2:00 PM
0 14 * * 1 {python_path} {script_path} --weekly >> /Users/ugochi141/Desktop/LabAutomation/logs/inventory_cron.log 2>&1
"""
    
    print("To set up automated inventory checks, add this to your crontab:")
    print("Run: crontab -e")
    print("\nAdd these lines:")
    print(cron_config)
    
    # Save to file for reference
    with open("cron_setup.txt", 'w') as f:
        f.write(cron_config)
    print("\nCron configuration saved to: cron_setup.txt")

def main():
    """Main execution function"""
    print("Scheduled Inventory Check System")
    print("=" * 60)
    
    # Check for command line arguments
    if '--setup' in sys.argv:
        setup_cron_job()
        return
    
    if '--status' in sys.argv:
        checker = ScheduledInventoryCheck()
        report = checker.generate_status_report()
        print("\nSystem Status:")
        for key, value in report.items():
            print(f"  {key}: {value}")
        return
    
    # Run inventory check
    try:
        checker = ScheduledInventoryCheck()
        
        # Check if forced run or scheduled
        if '--force' in sys.argv or '--weekly' in sys.argv:
            print("Forcing inventory check...")
            checker.run_inventory_check()
        elif checker.should_run_check():
            print("Running scheduled inventory check...")
            checker.run_inventory_check()
        else:
            print("Not scheduled to run at this time")
            print(f"Daily check time: {checker.config['schedule']['daily_check_time']}")
            print(f"Weekly summary: {checker.config['schedule']['weekly_summary_day']}s")
            
    except Exception as e:
        logging.error(f"Error during inventory check: {e}")
        raise

if __name__ == "__main__":
    main()



