#!/bin/bash

# Largo Lab Portal - Deployment Script
echo "🚀 Deploying Largo Lab Portal..."

# Create necessary directories if they don't exist
mkdir -p css js schedules inventory staff resources assets

# Create a simple local server script if Python is available
cat > start-server.py << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"✅ Largo Lab Portal is running at http://localhost:{PORT}")
    print(f"📋 Direct link: http://localhost:{PORT}/index.html")
    print("Press Ctrl+C to stop the server")

    # Open browser automatically
    webbrowser.open(f'http://localhost:{PORT}/index.html')

    httpd.serve_forever()
EOF

# Make the script executable
chmod +x start-server.py

# Create a simple KP logo SVG if not exists
cat > assets/kp-logo.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" fill="#0066cc">
  <text x="10" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="bold">KP</text>
</svg>
EOF

echo "✅ Portal files created successfully!"
echo ""
echo "📁 Portal Structure:"
echo "   - index.html (Main portal)"
echo "   - css/ (Styling with KP branding)"
echo "   - js/ (Functionality)"
echo "   - schedules/ (Daily schedule system)"
echo "   - inventory/ (Order management)"
echo "   - assets/ (Images and resources)"
echo ""
echo "🌐 To run the portal locally:"
echo "   1. Run: python3 start-server.py"
echo "   2. Open: http://localhost:8080"
echo ""
echo "📤 To deploy to GitHub Pages:"
echo "   1. git init (if not already initialized)"
echo "   2. git add ."
echo "   3. git commit -m 'Deploy Largo Lab Portal v2.0'"
echo "   4. git branch -M main"
echo "   5. git remote add origin https://github.com/ugochi141/largo-lab-portal.git"
echo "   6. git push -u origin main"
echo "   7. Go to Settings > Pages > Deploy from main branch"
echo ""
echo "✨ Portal is ready for use!"