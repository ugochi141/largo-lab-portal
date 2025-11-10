#!/usr/bin/env python3
"""
Test Notion Database Access
"""

import asyncio
import aiohttp
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_database_access():
    """Test Notion database access"""
    
    # Load token from environment
    TOKEN = os.getenv('NOTION_API_TOKEN_PRIMARY') or os.getenv('NOTION_API_TOKEN')
    PERFORMANCE_DB_ID = os.getenv('NOTION_PERFORMANCE_DB_ID')
    
    print(f"Using token: {TOKEN[:15]}...")
    print(f"Testing database: {PERFORMANCE_DB_ID}")
    
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            print("🧪 Testing database access...")
            
            # Query the performance database
            query_data = {
                "page_size": 1
            }
            
            async with session.post(
                f"https://api.notion.com/v1/databases/{PERFORMANCE_DB_ID}/query",
                headers=headers,
                json=query_data
            ) as response:
                
                print(f"Response status: {response.status}")
                response_text = await response.text()
                
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Database access successful!")
                    print(f"   Found {len(data.get('results', []))} records")
                elif response.status == 400:
                    print(f"❌ Bad Request (400): Check your database ID and request format")
                    try:
                        error_data = json.loads(response_text)
                        print(f"   Error: {error_data.get('message', 'Unknown error')}")
                    except:
                        print(f"   Raw error: {response_text}")
                elif response.status == 401:
                    print(f"❌ Unauthorized (401): Check your API token")
                elif response.status == 403:
                    print(f"❌ Forbidden (403): Token doesn't have access to this database")
                elif response.status == 404:
                    print(f"❌ Not Found (404): Database ID is incorrect or doesn't exist")
                else:
                    print(f"❌ Unexpected error: {response.status}")
                    
                print(f"Raw response: {response_text[:500]}")
                    
        except Exception as e:
            print(f"❌ Connection test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_database_access())