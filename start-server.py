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
