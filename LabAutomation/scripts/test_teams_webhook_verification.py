#!/usr/bin/env python3
"""
Teams Webhook Verification Test
Handles proper webhook verification for Microsoft Teams
"""

import asyncio
import aiohttp
import json
import hmac
import hashlib
import base64
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

async def test_webhook_verification():
    """Test Teams webhook with proper verification"""
    
    webhook_url = os.getenv('TEAMS_WEBHOOK_URL')
    
    print('🔗 Teams Webhook Verification Test')
    print('=' * 50)
    print(f'Webhook URL: {webhook_url[:80]}...')
    print()
    
    # Test 1: Standard message (this should work)
    print('✅ Test 1: Standard message')
    standard_message = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": "Lab Automation Webhook Test",
        "sections": [{
            "activityTitle": "🧪 Lab Automation System",
            "activitySubtitle": "Webhook Connection Verified",
            "facts": [
                {"name": "Test Time", "value": datetime.now().strftime('%Y-%m-%d %H:%M:%S')},
                {"name": "Status", "value": "✅ Connection Successful"},
                {"name": "Verification", "value": "Webhook is working correctly"}
            ],
            "markdown": True
        }]
    }
    
    headers = {'Content-Type': 'application/json'}
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(webhook_url, headers=headers, json=standard_message) as response:
                if response.status == 200:
                    print('✅ Standard message sent successfully')
                else:
                    print(f'❌ Standard message failed: {response.status}')
                    error_text = await response.text()
                    print(f'   Error: {error_text}')
        except Exception as e:
            print(f'❌ Standard message error: {e}')
    
    print()
    
    # Test 2: Alert-style message
    print('🚨 Test 2: Alert-style message')
    alert_message = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "FF0000",
        "summary": "Lab Alert Test",
        "sections": [{
            "activityTitle": "🚨 Lab Alert System Test",
            "activitySubtitle": "Critical Value Alert Simulation",
            "facts": [
                {"name": "Patient ID", "value": "TEST-001"},
                {"name": "Test", "value": "Glucose"},
                {"name": "Value", "value": "450 mg/dL"},
                {"name": "Reference Range", "value": "70-100 mg/dL"},
                {"name": "Status", "value": "🔴 CRITICAL"}
            ],
            "markdown": True
        }],
        "potentialAction": [{
            "@type": "OpenUri",
            "name": "View Details",
            "targets": [{"os": "default", "uri": "https://lab-dashboard.kaiserpermanente.org"}]
        }]
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(webhook_url, headers=headers, json=alert_message) as response:
                if response.status == 200:
                    print('✅ Alert message sent successfully')
                else:
                    print(f'❌ Alert message failed: {response.status}')
                    error_text = await response.text()
                    print(f'   Error: {error_text}')
        except Exception as e:
            print(f'❌ Alert message error: {e}')
    
    print()
    
    # Test 3: Simple text message
    print('📝 Test 3: Simple text message')
    simple_message = {
        "text": "Lab Automation System: Webhook verification test completed successfully ✅"
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(webhook_url, headers=headers, json=simple_message) as response:
                if response.status == 200:
                    print('✅ Simple text message sent successfully')
                else:
                    print(f'❌ Simple text message failed: {response.status}')
                    error_text = await response.text()
                    print(f'   Error: {error_text}')
        except Exception as e:
            print(f'❌ Simple text message error: {e}')
    
    print()
    print('🎉 Webhook verification tests completed!')
    print('Check your Teams channel for the test messages.')

def validate_webhook_url(url):
    """Validate Teams webhook URL format"""
    if not url:
        return False, "Webhook URL is empty"
    
    if not url.startswith('https://'):
        return False, "Webhook URL must use HTTPS"
    
    if 'webhook.office.com' not in url:
        return False, "Invalid Teams webhook domain"
    
    if 'webhookb2' not in url:
        return False, "This appears to be an old webhook format"
    
    return True, "Webhook URL format is valid"

if __name__ == "__main__":
    # Validate webhook URL first
    webhook_url = os.getenv('TEAMS_WEBHOOK_URL')
    is_valid, message = validate_webhook_url(webhook_url)
    
    if not is_valid:
        print(f"❌ Webhook validation failed: {message}")
        exit(1)
    
    print(f"✅ Webhook validation passed: {message}")
    print()
    
    # Run tests
    asyncio.run(test_webhook_verification())