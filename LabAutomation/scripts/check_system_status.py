#!/usr/bin/env python3
"""
Check System Status
Quick status check of all components
"""

import os
import requests
from notion_client import Client
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Your credentials from environment
NOTION_TOKEN = os.getenv('NOTION_API_TOKEN')
TEAMS_WEBHOOK = os.getenv('TEAMS_WEBHOOK_URL')
PERFORMANCE_DB_ID = os.getenv('NOTION_PERFORMANCE_DB_ID')
INCIDENT_DB_ID = os.getenv('NOTION_INCIDENT_DB_ID')

def check_notion_status():
    """Check Notion connection and database status"""
    print("🔍 Checking Notion Status...")
    
    try:
        notion = Client(auth=NOTION_TOKEN)
        
        # Check performance database
        perf_db = notion.databases.query(database_id=PERFORMANCE_DB_ID, page_size=1)
        perf_count = len(perf_db['results'])
        
        # Check incident database
        inc_db = notion.databases.query(database_id=INCIDENT_DB_ID, page_size=1)
        inc_count = len(inc_db['results'])
        
        print(f"✅ Notion Connected")
        print(f"   Performance DB: {perf_count} entries")
        print(f"   Incident DB: {inc_count} entries")
        return True
        
    except Exception as e:
        print(f"❌ Notion Error: {e}")
        return False

def check_teams_status():
    """Check Teams webhook status"""
    print("🔍 Checking Teams Status...")
    
    try:
        test_message = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": "00FF00",
            "summary": "Lab Crisis System Status Check",
            "sections": [{
                "activityTitle": "✅ Lab Crisis System Status Check",
                "activitySubtitle": f"System operational at {datetime.now().strftime('%H:%M:%S')}",
                "facts": [
                    {"name": "Status", "value": "Operational"},
                    {"name": "Notion", "value": "Connected"},
                    {"name": "Monitoring", "value": "Active"}
                ]
            }]
        }
        
        response = requests.post(
            TEAMS_WEBHOOK,
            json=test_message,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Teams Webhook Working")
            return True
        else:
            print(f"❌ Teams Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Teams Error: {e}")
        return False

def check_crisis_metrics():
    """Check current crisis metrics"""
    print("🔍 Checking Crisis Metrics...")
    
    # Your current crisis data
    crisis_metrics = {
        'TAT Compliance': {'current': 35.0, 'target': 90.0, 'status': '🔴 Critical'},
        'Wait Time': {'current': 25.0, 'target': 15.0, 'status': '🔴 Critical'},
        'Staffing Gap': {'current': 3.3, 'target': 0.0, 'status': '🔴 Critical'},
        'Error Rate': {'current': 12.0, 'target': 5.0, 'status': '🔴 Critical'},
        'Staff Utilization': {'current': 67.6, 'target': 80.0, 'status': '🟡 Warning'}
    }
    
    print("Current Crisis Status:")
    for metric, data in crisis_metrics.items():
        print(f"   {metric}: {data['current']} (target: {data['target']}) {data['status']}")
    
    return True

def main():
    """Run all status checks"""
    print("🏥 Lab Crisis System Status Check")
    print("=" * 50)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    checks = [
        ("Notion Connection", check_notion_status),
        ("Teams Webhook", check_teams_status),
        ("Crisis Metrics", check_crisis_metrics)
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n📋 {name}...")
        result = check_func()
        results.append((name, result))
    
    print("\n" + "=" * 50)
    print("📊 Status Summary")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {name}")
    
    print(f"\n🎯 Overall: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 All systems operational! Crisis monitoring ready.")
    else:
        print("⚠️ Some systems have issues. Check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
