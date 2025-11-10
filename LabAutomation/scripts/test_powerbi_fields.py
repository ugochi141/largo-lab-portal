import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def test_powerbi_with_exact_fields():
    """Test Power BI with exact field names from the schema"""
    
    # Based on your Power BI screenshots, the exact field names appear to be:
    # Note the space after some field names in your setup!
    
    monitor_data = [{
        "Timestamp": datetime.utcnow().isoformat() + "Z",
        "StaffName": "Test User",
        "Shift": "Day",
        "Department": "Lab A",
        "TAT": 98.6,
        "QCCompliance": 98.6,
        "ErrorCount": 98.6,
        "BreakDuration": 98.6,
        "PerformanceScore": 98.6,
        "TasksCompleted": 98.6,
        "ComplianceStatus": "AAAAA555555",
        "AlertLevel": "AAAAA555555"
    }]
    
    # For Metrics dataset - try without trailing spaces first
    metrics_data = [{
        "Timestamp": datetime.utcnow().isoformat() + "Z",
        "StaffName": "Test User",
        "Shift": "Day",
        "Department": "Lab A",
        "TAT": 98.6,
        "QCCompliance": 98.6,
        "ErrorCount": 98.6,
        "BreakDuration": 98.6,
        "PerformanceScore": 98.6,
        "TasksCompleted": 98.6,
        "ComplianceStatus": "AAAAA555555",
        "AlertLevel": "AAAAA555555"
    }]
    
    # Test Monitor dataset
    print("Testing Lab Performance Monitor...")
    monitor_url = os.getenv("POWERBI_MONITOR_PUSH_URL")
    
    try:
        response = requests.post(
            monitor_url,
            data=json.dumps(monitor_data),
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Monitor dataset: Success!")
        else:
            print(f"❌ Monitor dataset: {response.status_code}")
            print(f"   Response: {response.text}")
            
            # If it fails, try with trailing spaces (as shown in your screenshots)
            print("\n   Retrying with trailing spaces...")
            monitor_data_with_spaces = [{
                "Timestamp ": datetime.utcnow().isoformat() + "Z",
                "StaffName ": "Test User",
                "Shift ": "Day",
                "Department": "Lab A",
                "TAT ": 98.6,
                "QCCompliance ": 98.6,
                "ErrorCount": 98.6,
                "BreakDuration": 98.6,
                "PerformanceScore": 98.6,
                "TasksCompleted": 98.6,
                "ComplianceStatus": "AAAAA555555",
                "AlertLevel ": "AAAAA555555"
            }]
            
            response2 = requests.post(
                monitor_url,
                data=json.dumps(monitor_data_with_spaces),
                headers={"Content-Type": "application/json"}
            )
            
            if response2.status_code == 200:
                print("   ✅ Success with trailing spaces!")
            else:
                print(f"   ❌ Still failed: {response2.text[:200]}")
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test Metrics dataset
    print("\nTesting Lab Performance Metrics...")
    metrics_url = os.getenv("POWERBI_METRICS_PUSH_URL")
    
    try:
        response = requests.post(
            metrics_url,
            data=json.dumps(metrics_data),
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Metrics dataset: Success!")
        else:
            print(f"❌ Metrics dataset: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def list_required_fields():
    """Parse error messages to understand required fields"""
    
    print("\n" + "="*50)
    print("IMPORTANT: Power BI Field Name Requirements")
    print("="*50)
    print("""
    Based on your Power BI setup screenshots, some fields have trailing spaces!
    
    Lab Performance Monitor fields:
    - Timestamp (check if it needs a trailing space)
    - StaffName (check if it needs a trailing space)
    - Shift (has trailing space in your setup: "Shift ")
    - TAT (has trailing space in your setup: "TAT ")
    - QCCompliance (has trailing space: "QCCompliance ")
    - Others...
    
    To fix this:
    1. Go back to Power BI
    2. Edit each streaming dataset
    3. Remove trailing spaces from field names
    4. Click "Done" to save
    
    OR use the field names exactly as they are (with spaces)
    """)

if __name__ == "__main__":
    test_powerbi_with_exact_fields()
    list_required_fields()





