#!/bin/bash

# Start API Server for Call Center Customization Assistance
# This script starts the standalone HTTP API server that serves customization guides

echo "🚀 Starting Call Center Customization API Server..."
echo ""

# Navigate to API server directory
cd "$(dirname "$0")/api-server"

# Check if server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Server is already running on port 3000"
    echo ""
    echo "Options:"
    echo "  1. Stop the existing server:"
    echo "     kill -9 \$(lsof -t -i:3000)"
    echo ""
    echo "  2. Use the existing server (it's already running!)"
    echo ""
    echo "To verify server is running:"
    echo "  curl http://localhost:3000/health"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "✅ Starting server on http://localhost:3000"
echo ""
echo "Available endpoints:"
echo "  - GET  /health              - Health check"
echo "  - GET  /api/guides          - List all guides"
echo "  - GET  /api/guides/:id      - Get guide by ID"
echo "  - GET  /api/guides/:id/html - Get guide as HTML"
echo "  - GET  /api/guides/search/:query - Search guides"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start

# Made with Bob
