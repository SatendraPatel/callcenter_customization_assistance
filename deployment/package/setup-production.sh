#!/bin/bash

# Production Setup Script for OMS Call Center Customization Assistant
# This script sets up PM2 to keep servers running permanently

set -e

echo "🚀 Setting up Production Environment with PM2"
echo "=============================================="
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
    echo "✅ PM2 installed successfully"
else
    echo "✅ PM2 is already installed"
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Install API server dependencies
echo "📦 Installing API server dependencies..."
cd api-server
npm install
cd ..

# Stop any existing PM2 processes
echo "🛑 Stopping any existing processes..."
pm2 delete all 2>/dev/null || true

# Start services using PM2
echo "🚀 Starting services with PM2..."
pm2 start pm2-ecosystem.config.js

# Save PM2 process list
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on system boot
echo "🔧 Configuring PM2 to start on boot..."
pm2 startup

echo ""
echo "✅ Production setup complete!"
echo ""
echo "📊 Service Status:"
pm2 status

echo ""
echo "📝 Useful PM2 Commands:"
echo "  pm2 status          - View service status"
echo "  pm2 logs            - View all logs"
echo "  pm2 logs oms-api-server  - View API server logs"
echo "  pm2 logs oms-web-server  - View web server logs"
echo "  pm2 restart all     - Restart all services"
echo "  pm2 stop all        - Stop all services"
echo "  pm2 monit           - Monitor services in real-time"
echo ""
echo "🌐 Access the application at: http://$(hostname -I | awk '{print $1}'):9090"
echo ""
echo "⚠️  IMPORTANT: Run the following command as root to enable startup on boot:"
echo "   sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u $(whoami) --hp $(eval echo ~$(whoami))"
echo ""

# Made with Bob
