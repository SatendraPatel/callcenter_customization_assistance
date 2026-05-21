#!/bin/bash

# Stop API Server for Call Center Customization Assistance

echo "🛑 Stopping Call Center Customization API Server..."
echo ""

# Check if server is running
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "ℹ️  Server is not running on port 3000"
    exit 0
fi

# Get the PID
PID=$(lsof -t -i:3000)

# Kill the process
kill -9 $PID

if [ $? -eq 0 ]; then
    echo "✅ Server stopped successfully (PID: $PID)"
else
    echo "❌ Failed to stop server"
    exit 1
fi

# Made with Bob
