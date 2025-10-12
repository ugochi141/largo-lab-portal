#!/usr/bin/env python3
"""
Enhanced Lab Crisis Monitor
Robust error handling and comprehensive monitoring
"""

import os
import sys
import json
import time
import logging
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/crisis_monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class EnhancedCrisisMonitor:
    def __init__(self):
        self.notion_token = os.getenv('NOTION_API_TOKEN')
        self.teams_webhook = os.getenv('TEAMS_WEBHOOK_URL')
        self.performance_db_id = os.getenv('NOTION_PERFORMANCE_DB_ID')
        self.incident_db_id = os.getenv('NOTION_INCIDENT_DB_ID')

        # Notion integration retired (October 2025)
        if self.notion_token and self.notion_token != 'your_notion_token_here':
            logger.info("ℹ️ Notion credentials detected but integration is retired; operating in offline mode")
        else:
            logger.info("✅ Running without Notion integration (expected configuration)")
        self.notion = None
    
    def check_system_health(self):
        """Comprehensive system health check"""
        health_status = {
            'timestamp': datetime.now().isoformat(),
            'notion_connected': None,  # None indicates intentionally disabled
            'teams_webhook_working': False,
            'databases_accessible': None,
            'overall_status': 'UNKNOWN'
        }

        # Check Teams webhook
        if self.teams_webhook and self.teams_webhook != 'your_teams_webhook_url_here':
            try:
                test_payload = {
                    "text": "🔍 Lab Crisis Monitor - System Health Check",
                    "timestamp": datetime.now().isoformat()
                }
                response = requests.post(self.teams_webhook, json=test_payload, timeout=10)
                if response.status_code == 200:
                    health_status['teams_webhook_working'] = True
                    logger.info("✅ Teams webhook verified")
                else:
                    logger.error(f"❌ Teams webhook failed: {response.status_code}")
            except Exception as e:
                logger.error(f"❌ Teams webhook error: {e}")
        
        # Determine overall status (Notion disabled is acceptable)
        if health_status['teams_webhook_working']:
            health_status['overall_status'] = 'HEALTHY'
        else:
            health_status['overall_status'] = 'CRITICAL'
        
        return health_status
    
    def create_crisis_alert(self, alert_type, message, severity='HIGH'):
        """Create crisis alert with enhanced error handling"""
        if not self.notion or not self.incident_db_id:
            logger.info("ℹ️ Notion integration retired; crisis alert stored via Teams and audit log only")
            return False
        
        try:
            alert_data = {
                "Alert Type": {"title": [{"text": {"content": alert_type}}]},
                "Message": {"rich_text": [{"text": {"content": message}}]},
                "Severity": {"select": {"name": severity}},
                "Timestamp": {"date": {"start": datetime.now().isoformat()}},
                "Status": {"select": {"name": "Active"}}
            }
            
            self.notion.pages.create(
                parent={"database_id": self.incident_db_id},
                properties=alert_data
            )
            logger.info(f"✅ Created {severity} alert: {alert_type}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to create alert: {e}")
            return False
    
    def send_teams_alert(self, title, message, color="FF0000"):
        """Send Teams alert with retry logic"""
        if not self.teams_webhook or self.teams_webhook == 'your_teams_webhook_url_here':
            logger.warning("⚠️ Teams webhook not configured")
            return False
        
        payload = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": color,
            "summary": title,
            "sections": [{
                "activityTitle": title,
                "activitySubtitle": f"Lab Crisis Monitor - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                "activityImage": "https://img.icons8.com/color/48/000000/warning.png",
                "text": message,
                "markdown": True
            }]
        }
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = requests.post(
                    self.teams_webhook, 
                    json=payload, 
                    timeout=10,
                    headers={'Content-Type': 'application/json'}
                )
                if response.status_code == 200:
                    logger.info("✅ Teams alert sent successfully")
                    return True
                else:
                    logger.warning(f"⚠️ Teams webhook returned {response.status_code}, attempt {attempt + 1}")
            except Exception as e:
                logger.error(f"❌ Teams alert attempt {attempt + 1} failed: {e}")
            
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
        
        logger.error("❌ All Teams alert attempts failed")
        return False
    
    def monitor_crisis_metrics(self):
        """Monitor crisis metrics with enhanced error handling"""
        logger.info("🔍 Starting crisis metrics monitoring...")
        
        # Simulate crisis metrics (replace with actual data source)
        crisis_metrics = {
            'tat_compliance': 35.0,  # Target: 90.0
            'wait_time': 25.0,       # Target: 15.0
            'staffing_gap': 3.3,     # Target: 0.0
            'error_rate': 12.0,      # Target: 5.0
            'staff_utilization': 67.6  # Target: 80.0
        }
        
        alerts_triggered = []
        
        # Check TAT Compliance
        if crisis_metrics['tat_compliance'] < 60:
            alert_msg = f"🚨 CRITICAL: TAT Compliance at {crisis_metrics['tat_compliance']}% (Target: 90%)"
            alerts_triggered.append(alert_msg)
            self.create_crisis_alert("TAT Compliance Crisis", alert_msg, "CRITICAL")
        
        # Check Wait Time
        if crisis_metrics['wait_time'] > 20:
            alert_msg = f"⚠️ HIGH: Wait time at {crisis_metrics['wait_time']} minutes (Target: 15 min)"
            alerts_triggered.append(alert_msg)
            self.create_crisis_alert("Wait Time Alert", alert_msg, "HIGH")
        
        # Check Staffing Gap
        if crisis_metrics['staffing_gap'] > 2:
            alert_msg = f"⚠️ HIGH: Staffing gap of {crisis_metrics['staffing_gap']} positions"
            alerts_triggered.append(alert_msg)
            self.create_crisis_alert("Staffing Crisis", alert_msg, "HIGH")
        
        # Check Error Rate
        if crisis_metrics['error_rate'] > 10:
            alert_msg = f"🚨 CRITICAL: Error rate at {crisis_metrics['error_rate']}% (Target: 5%)"
            alerts_triggered.append(alert_msg)
            self.create_crisis_alert("Error Rate Crisis", alert_msg, "CRITICAL")
        
        # Send Teams summary if alerts triggered
        if alerts_triggered:
            summary_msg = "\n".join(alerts_triggered)
            self.send_teams_alert(
                "🚨 Lab Crisis Alerts",
                f"**Crisis Metrics Detected:**\n\n{summary_msg}\n\n**Immediate Action Required!**",
                "FF0000"
            )
        
        return crisis_metrics, alerts_triggered
    
    def run_monitoring_cycle(self):
        """Run a complete monitoring cycle"""
        logger.info("🔄 Starting monitoring cycle...")
        
        # Check system health first
        health = self.check_system_health()
        logger.info(f"System Health: {health['overall_status']}")
        
        if health['overall_status'] == 'CRITICAL':
            logger.error("❌ System health is critical, skipping monitoring cycle")
            return False
        
        # Monitor crisis metrics
        metrics, alerts = self.monitor_crisis_metrics()
        
        # Log results
        logger.info(f"📊 Crisis Metrics: {metrics}")
        logger.info(f"🚨 Alerts Triggered: {len(alerts)}")
        
        return True

def main():
    """Main execution function"""
    print("🏥 Enhanced Lab Crisis Monitor Starting...")
    print("=" * 50)
    
    # Create necessary directories
    os.makedirs('logs', exist_ok=True)
    
    # Initialize monitor
    monitor = EnhancedCrisisMonitor()
    
    # Run monitoring cycle
    success = monitor.run_monitoring_cycle()
    
    if success:
        print("✅ Monitoring cycle completed successfully")
    else:
        print("❌ Monitoring cycle failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
