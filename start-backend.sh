#!/bin/bash

# Start Backend Server Script
# Starts the Express backend server for the Largo Laboratory Portal

echo "🚀 Starting Largo Laboratory Portal Backend Server..."
echo ""

cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

# Start the server
echo "🔌 Starting Express server on port 3000..."
echo "📊 API will be available at: http://localhost:3000/api"
echo "📋 Inventory endpoint: http://localhost:3000/api/inventory"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

node index.js
