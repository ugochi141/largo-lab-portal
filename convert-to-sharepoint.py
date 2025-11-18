#!/usr/bin/env python3
"""
SharePoint Path Converter
Converts GitHub Pages file paths to SharePoint paths
"""

import os
import re
import shutil
from pathlib import Path

# SharePoint site configuration
SHAREPOINT_SITE = "LargoLabTeamPortal"
SHAREPOINT_BASE = f"/sites/{SHAREPOINT_SITE}"

# Path conversions
PATH_MAPPINGS = {
    r'href="\.\./assets/': f'href="{SHAREPOINT_BASE}/SiteAssets/assets/',
    r'href="assets/': f'href="{SHAREPOINT_BASE}/SiteAssets/assets/',
    r'href="\.\./css/': f'href="{SHAREPOINT_BASE}/SiteAssets/css/',
    r'href="css/': f'href="{SHAREPOINT_BASE}/SiteAssets/css/',
    r'src="\.\./js/': f'src="{SHAREPOINT_BASE}/SiteAssets/js/',
    r'src="js/': f'src="{SHAREPOINT_BASE}/SiteAssets/js/',
    r'href="\.\./index\.html"': f'href="{SHAREPOINT_BASE}/SitePages/Home.aspx"',
    r'href="index\.html"': f'href="{SHAREPOINT_BASE}/SitePages/Home.aspx"',
}

# Remove Home buttons (SharePoint has its own navigation)
HOME_BUTTON_PATTERNS = [
    r'<a href="\.\./index\.html" class="home-btn"[^>]*>.*?</a>',
    r'<a href="index\.html" class="home-btn"[^>]*>.*?</a>',
]

def convert_file(input_path, output_path):
    """Convert a single HTML file for SharePoint."""
    print(f"Converting: {input_path} → {output_path}")

    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply path conversions
    for pattern, replacement in PATH_MAPPINGS.items():
        content = re.sub(pattern, replacement, content)

    # Remove Home buttons
    for pattern in HOME_BUTTON_PATTERNS:
        content = re.sub(pattern, '', content, flags=re.DOTALL)

    # Add SharePoint viewport meta (if not present)
    if '<meta name="viewport"' not in content:
        content = content.replace(
            '</head>',
            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>'
        )

    # Add SharePoint comment header
    header = f"""<!--
    SharePoint Version - Converted for {SHAREPOINT_SITE}
    Original: {input_path.name}
    Conversion Date: 2025-11-04
-->
"""
    content = content.replace('<!DOCTYPE html>', f'<!DOCTYPE html>\n{header}')

    # Write output
    os.makedirs(output_path.parent, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  ✓ Converted successfully")

def convert_directory(input_dir, output_dir):
    """Convert all HTML files in a directory."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)

    html_files = list(input_path.glob('**/*.html'))

    print(f"\nFound {len(html_files)} HTML files to convert\n")

    for html_file in html_files:
        # Calculate relative path
        rel_path = html_file.relative_to(input_path)
        output_file = output_path / rel_path

        # Convert file
        convert_file(html_file, output_file)

    # Copy CSS and JS files
    print("\nCopying static assets...")

    for asset_type in ['css', 'js', 'assets']:
        source = input_path / asset_type
        if source.exists():
            dest = output_path / 'SiteAssets' / asset_type
            if dest.exists():
                shutil.rmtree(dest)
            shutil.copytree(source, dest)
            print(f"  ✓ Copied {asset_type}/")

def main():
    """Main conversion process."""
    print("=" * 60)
    print("SharePoint Path Converter")
    print("Kaiser Permanente Largo Laboratory Portal")
    print("=" * 60)

    # Get current directory
    current_dir = Path.cwd()

    # Create output directory
    output_dir = current_dir / 'sharepoint-ready'

    if output_dir.exists():
        print(f"\nRemoving existing output directory: {output_dir}")
        shutil.rmtree(output_dir)

    output_dir.mkdir(exist_ok=True)

    # Convert files
    convert_directory(current_dir, output_dir)

    print("\n" + "=" * 60)
    print("✅ Conversion Complete!")
    print("=" * 60)
    print(f"\nSharePoint-ready files: {output_dir}")
    print("\nNext steps:")
    print("1. Upload files from sharepoint-ready/ to SharePoint")
    print("2. Create Site Pages using the converted HTML")
    print("3. Upload SiteAssets/ to SharePoint SiteAssets library")
    print("4. Test all pages and navigation")
    print("\nSee SHAREPOINT-QUICK-START.md for detailed instructions")

if __name__ == '__main__':
    main()
