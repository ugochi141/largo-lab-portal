#!/usr/bin/env python3
"""
Complete Deployment Script for Teams-to-Notion Integration
Combines all webhook functionality for Railway deployment
"""

import sys
import os
from pathlib import Path

# Add scripts directory to path
current_dir = Path(__file__).parent
scripts_dir = current_dir / 'scripts'
sys.path.insert(0, str(scripts_dir))

# Import Flask apps
try:
    from complete_teams_notion_webhook import app
    print("✅ Successfully imported Teams-to-Notion webhook")
except ImportError as e:
    print(f"❌ Failed to import webhook: {e}")
    sys.exit(1)

if __name__ == '__main__':
    # Use PORT from environment (Railway sets this)
    port = int(os.getenv('PORT', 8080))
    
    print("🚀 Starting Complete Teams-to-Notion Integration")
    print(f"🌐 Port: {port}")
    print(f"📡 Webhook URL: /webhook/teams-to-notion")
    print(f"🧪 Test URL: /test")
    print(f"🏥 Health URL: /health")
    print(f"🏷️  Keywords URL: /keywords")
    print("=" * 60)
    
    # Run in production mode for Railway
    app.run(host='0.0.0.0', port=port, debug=False)