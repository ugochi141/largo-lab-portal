#!/usr/bin/env python3
"""
Power Automate to Notion Webhook
Optimized for Power Automate Teams flow integration
"""

from flask import Flask, request, jsonify
import json
import logging
import os
import re
import asyncio
from datetime import datetime
from dotenv import load_dotenv
import aiohttp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
NOTION_API_TOKEN = os.getenv('NOTION_API_TOKEN_PRIMARY') or os.getenv('NOTION_API_TOKEN')
NOTION_VERSION = os.getenv('NOTION_VERSION', '2022-06-28')
NOTION_INCIDENT_DB_ID = os.getenv('NOTION_INCIDENT_DB_ID')

@app.route('/webhook/power-automate', methods=['POST'])
def power_automate_webhook():
    """Handle Power Automate webhook for Teams-to-Notion integration"""
    
    try:
        # Get the webhook data from Power Automate
        data = request.get_json()
        
        if not data:
            logger.warning("No data received from Power Automate")
            return jsonify({'status': 'no_data', 'message': 'No JSON data received'}), 400
        
        logger.info(f"Received Power Automate data: {json.dumps(data, indent=2)}")
        
        # Extract and validate required fields
        message_text = data.get('text', '').strip()
        if not message_text:
            logger.warning("No message text in Power Automate data")
            return jsonify({'status': 'no_message', 'message': 'Missing message text'}), 400
        
        # Extract metadata
        sender_name = data.get('from', {}).get('name', 'Unknown')
        channel_name = data.get('channelData', {}).get('channel', {}).get('name', 'Unknown')
        team_name = data.get('channelData', {}).get('team', {}).get('name', 'Unknown')
        message_id = data.get('messageId', 'unknown')
        timestamp = data.get('timestamp', datetime.now().isoformat())
        
        # Detect keywords from the message
        detected_keywords = detect_keywords(message_text)
        
        # Create Notion page
        page_id = asyncio.run(create_notion_incident_page(
            message_text=message_text,
            sender_name=sender_name,
            channel_name=channel_name,
            team_name=team_name,
            message_id=message_id,
            timestamp=timestamp,
            keywords=detected_keywords
        ))
        
        if page_id:
            return jsonify({
                'status': 'success',
                'message': 'Notion page created successfully',
                'notion_page_id': page_id,
                'keywords_detected': detected_keywords,
                'sender': sender_name,
                'channel': channel_name
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to create Notion page'
            }), 500
        
    except Exception as e:
        logger.error(f"Power Automate webhook error: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

def detect_keywords(text):
    """Detect keywords in the message text"""
    
    keywords = [
        # Critical keywords
        'incident', 'critical', 'urgent', 'emergency', 'alert',
        # Lab keywords  
        'lab', 'patient', 'sample', 'test', 'result', 'specimen',
        # Technical keywords
        'error', 'failure', 'down', 'outage', 'malfunction',
        # Quality keywords
        'contamination', 'calibration', 'qc', 'quality control',
        # Process keywords
        'delay', 'backlog', 'issue', 'problem'
    ]
    
    detected = []
    text_lower = text.lower()
    
    for keyword in keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
            detected.append(keyword)
    
    return detected

async def create_notion_incident_page(message_text, sender_name, channel_name, team_name, message_id, timestamp, keywords):
    """Create incident page in Notion"""
    
    if not NOTION_API_TOKEN or not NOTION_INCIDENT_DB_ID:
        logger.error("Notion API token or database ID not configured")
        return None
    
    headers = {
        'Authorization': f'Bearer {NOTION_API_TOKEN}',
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
    }
    
    # Determine severity based on keywords
    severity = determine_severity(keywords)
    
    # Generate incident ID
    incident_id = f"PA-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    
    # Create comprehensive description
    description = f"""**Teams Message Alert via Power Automate**

**Original Message:**
{message_text}

**Message Details:**
• **Sender**: {sender_name}
• **Channel**: {channel_name}
• **Team**: {team_name}
• **Message ID**: {message_id}
• **Detection Time**: {timestamp}

**Keywords Detected:**
{', '.join(keywords) if keywords else 'None'}

**Severity Assessment:**
Auto-classified as {severity} based on keyword analysis.

**Next Steps:**
1. Review and validate the incident
2. Assign to appropriate team member
3. Update status as investigation progresses
4. Document resolution steps
"""
    
    # Create page data
    page_data = {
        'parent': {
            'database_id': NOTION_INCIDENT_DB_ID
        },
        'properties': {
            'Incident ID': {
                'title': [
                    {
                        'text': {
                            'content': incident_id
                        }
                    }
                ]
            },
            'Date/Time': {
                'date': {
                    'start': timestamp
                }
            },
            'Staff Member': {
                'select': {
                    'name': sender_name
                }
            },
            'Incident Type': {
                'select': {
                    'name': 'Power Automate Alert'
                }
            },
            'Severity': {
                'select': {
                    'name': severity
                }
            },
            'Impact': {
                'select': {
                    'name': 'To Be Determined'
                }
            },
            'Description': {
                'rich_text': [
                    {
                        'text': {
                            'content': description
                        }
                    }
                ]
            },
            'Status': {
                'select': {
                    'name': 'Open'
                }
            }
        }
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                'https://api.notion.com/v1/pages',
                headers=headers,
                json=page_data
            ) as response:
                
                if response.status == 200:
                    result = await response.json()
                    page_id = result.get('id')
                    logger.info(f"✅ Created Notion incident page: {page_id}")
                    logger.info(f"   Incident ID: {incident_id}")
                    logger.info(f"   Sender: {sender_name}")
                    logger.info(f"   Keywords: {keywords}")
                    return page_id
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Failed to create Notion page: {response.status}")
                    logger.error(f"   Error: {error_text}")
                    return None
                    
    except Exception as e:
        logger.error(f"❌ Exception creating Notion page: {e}")
        return None

def determine_severity(keywords):
    """Determine incident severity based on keywords"""
    
    if not keywords:
        return 'Low'
    
    critical_keywords = ['critical', 'urgent', 'emergency', 'failure', 'down', 'outage']
    high_keywords = ['incident', 'alert', 'error', 'problem', 'contamination']
    medium_keywords = ['issue', 'delay', 'qc', 'calibration']
    
    keywords_lower = [k.lower() for k in keywords]
    
    if any(k in keywords_lower for k in critical_keywords):
        return 'Critical'
    elif any(k in keywords_lower for k in high_keywords):
        return 'High'
    elif any(k in keywords_lower for k in medium_keywords):
        return 'Medium'
    else:
        return 'Low'

@app.route('/health', methods=['GET'])
def health_check():
    """Health check for Power Automate webhook"""
    return jsonify({
        'status': 'healthy',
        'service': 'power-automate-webhook',
        'timestamp': datetime.now().isoformat(),
        'configuration': {
            'notion_token': 'configured' if NOTION_API_TOKEN else 'missing',
            'incident_db': 'configured' if NOTION_INCIDENT_DB_ID else 'missing'
        }
    }), 200

@app.route('/test-power-automate', methods=['POST'])
def test_power_automate():
    """Test endpoint for Power Automate integration"""
    
    # Simulate Power Automate data format
    test_data = {
        'text': 'Critical lab incident: Patient sample contamination detected in room 5',
        'from': {
            'name': 'Dr. Sarah Johnson'
        },
        'channelData': {
            'channel': {
                'name': 'Lab Operations'
            },
            'team': {
                'name': 'Kaiser Permanente Lab Team'
            }
        },
        'messageId': f'test-{datetime.now().strftime("%Y%m%d%H%M%S")}',
        'timestamp': datetime.now().isoformat(),
        'powerAutomate': True
    }
    
    # Process test data
    request.json = test_data
    return power_automate_webhook()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    
    print(f"🚀 Starting Power Automate Webhook Server on port {port}")
    print(f"📡 Power Automate endpoint: /webhook/power-automate")
    print(f"🧪 Test endpoint: /test-power-automate")
    print(f"🏥 Health check: /health")
    
    app.run(host='0.0.0.0', port=port, debug=False)