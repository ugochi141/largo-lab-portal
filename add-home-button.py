#!/usr/bin/env python3
"""
Add Home button to all HTML pages in the Largo Lab Portal
"""

import os
import re

# Home button CSS and HTML
HOME_BUTTON_CSS = '''
        /* Home Button */
        .home-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #005EB8;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 94, 184, 0.3);
            z-index: 1000;
        }

        .home-btn:hover {
            background: #003d7a;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 94, 184, 0.5);
        }

        @media print {
            .home-btn {
                display: none !important;
            }
        }'''

# Pages in root directory
ROOT_PAGES = [
    'timecard-management.html',
    'inventory.html',
    'announcements-portal.html',
    'technical-support.html',
    'on-call-reference.html',
    'employee-portal.html'
]

# Pages in Schedules directory
SCHEDULE_PAGES = [
    'Schedules/QC_Maintenance_October_2025.html',
    'Schedules/QC_Maintenance_November_2025.html',
    'Schedules/QC_Maintenance_December_2025.html',
    'Schedules/phlebotomy-rotation.html',
    'Schedules/Schedule_Manager.html'
]

def add_home_button(file_path, home_link):
    """Add home button to an HTML file"""
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return False

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if home button already exists
        if '.home-btn' in content:
            print(f"⏭️  Skipped (already has Home button): {file_path}")
            return True

        # Add CSS before closing </style> tag (first occurrence)
        if '</style>' not in content:
            print(f"⚠️  No </style> tag found: {file_path}")
            return False

        content = content.replace('</style>', HOME_BUTTON_CSS + '\n    </style>', 1)

        # Add Home button HTML after <body> tag
        if '<body>' not in content:
            print(f"⚠️  No <body> tag found: {file_path}")
            return False

        home_button_html = f'    <a href="{home_link}" class="home-btn" aria-label="Return to homepage">🏠 Home</a>\n'
        content = content.replace('<body>', f'<body>\n{home_button_html}', 1)

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✅ Added Home button to: {file_path}")
        return True

    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    os.chdir('/Users/ugochindubuisi1/largo-lab-portal')

    print("🚀 Adding Home buttons to Largo Lab Portal pages...\n")

    # Process root pages
    print("📁 Processing root directory pages...")
    for page in ROOT_PAGES:
        add_home_button(page, 'index.html')

    print("\n📁 Processing Schedules directory pages...")
    # Process schedule pages
    for page in SCHEDULE_PAGES:
        add_home_button(page, '../index.html')

    print("\n✨ Done!")

if __name__ == '__main__':
    main()
