#!/bin/bash

# OMS Call Center Customization Assistant - Deployment Script
# This script packages and prepares the application for deployment

set -e

echo "🚀 OMS Call Center Customization Assistant - Deployment Package Creator"
echo "========================================================================"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOY_DIR="$SCRIPT_DIR/package"

# Clean previous deployment
echo "🧹 Cleaning previous deployment..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p "$DEPLOY_DIR/api-server"
mkdir -p "$DEPLOY_DIR/web"
mkdir -p "$DEPLOY_DIR/web/js"
mkdir -p "$DEPLOY_DIR/web/css"
mkdir -p "$DEPLOY_DIR/web/images"
mkdir -p "$DEPLOY_DIR/guides"

# Copy API server files
echo "📦 Copying API server files..."
cp "$PROJECT_ROOT/api-server/server.js" "$DEPLOY_DIR/api-server/"
cp "$PROJECT_ROOT/api-server/package.json" "$DEPLOY_DIR/api-server/"

# Copy guide data
echo "📚 Copying guide data..."
cp -r "$PROJECT_ROOT/mcp-server/src/guides/"* "$DEPLOY_DIR/guides/"

# Copy web files
echo "🌐 Copying web files..."
CHATBOT_DIR="/Users/satendrapatel/Documents/OMS/DTK2506/CallCenterCode_2506/callcenter-code"
cp "$CHATBOT_DIR/oms-chatbot-ui-watsonx.html" "$DEPLOY_DIR/web/index.html"
cp -r "$CHATBOT_DIR/js/"* "$DEPLOY_DIR/web/js/" 2>/dev/null || true
cp -r "$CHATBOT_DIR/css/"* "$DEPLOY_DIR/web/css/" 2>/dev/null || true
cp -r "$CHATBOT_DIR/images/"* "$DEPLOY_DIR/web/images/" 2>/dev/null || true

# Copy configuration files
echo "⚙️  Copying configuration files..."
cp "$SCRIPT_DIR/config.js" "$DEPLOY_DIR/"
cp "$SCRIPT_DIR/api-client-configurable.js" "$DEPLOY_DIR/web/js/api-client.js"
cp "$SCRIPT_DIR/pm2-ecosystem.config.js" "$DEPLOY_DIR/"
cp "$SCRIPT_DIR/setup-production.sh" "$DEPLOY_DIR/"
chmod +x "$DEPLOY_DIR/setup-production.sh"

# Create startup scripts
echo "🔧 Creating startup scripts..."

# API Server startup script
cat > "$DEPLOY_DIR/start-api-server.sh" << 'EOF'
#!/bin/bash
cd api-server
echo "🚀 Starting API Server..."
npm install
node server.js
EOF
chmod +x "$DEPLOY_DIR/start-api-server.sh"

# Web Server startup script
cat > "$DEPLOY_DIR/start-web-server.sh" << 'EOF'
#!/bin/bash
cd web
echo "🌐 Starting Web Server on port 9090..."
python3 -m http.server 9090
EOF
chmod +x "$DEPLOY_DIR/start-web-server.sh"

# Copy production documentation
echo "📚 Copying production documentation..."
cp "$SCRIPT_DIR/PRODUCTION_SETUP.md" "$DEPLOY_DIR/"

# Create README
cat > "$DEPLOY_DIR/README.md" << 'EOF'
# OMS Call Center Customization Assistant - Deployment Package

## Quick Start

### 1. Configure Server Details

Edit `config.js` and update with your server details:

```javascript
api: {
    host: 'your-server-ip',  // e.g., '192.168.1.100'
    port: 5000,
    protocol: 'http'
},
web: {
    host: 'your-server-ip',  // e.g., '192.168.1.100'
    port: 9090,
    protocol: 'http'
}
```

### 2. Start API Server

```bash
./start-api-server.sh
```

The API server will start on the configured port (default: 5000)

### 3. Start Web Server

In a new terminal:

```bash
./start-web-server.sh
```

The web interface will be available at: http://your-server-ip:9090

### 4. Access the Application

Open in browser: `http://your-server-ip:9090`

## Directory Structure

```
package/
├── api-server/          # API server (Express.js)
├── web/                 # Web interface (HTML/JS/CSS)
├── guides/              # Guide data (JSON files)
├── config.js            # Configuration file
├── start-api-server.sh  # API server startup script
├── start-web-server.sh  # Web server startup script
└── README.md            # This file
```

## Requirements

- Node.js 18+ (for API server)
- Python 3 (for web server, or use any HTTP server)

## Troubleshooting

### API Server Not Starting
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

### Web Server Not Starting
```bash
# Check if port 8080 is in use
lsof -i :8080

# Use different port
cd web && python3 -m http.server 9090
```

### Cannot Connect to API
1. Verify API server is running
2. Check firewall allows port 5000
3. Verify config.js has correct server IP
4. Test API: `curl http://your-server-ip:5000/health`

## Production Deployment

For production, consider:
1. Use HTTPS (update protocol in config.js)
2. Use a proper web server (nginx, Apache)
3. Set up process manager (PM2, systemd)
4. Configure firewall rules
5. Set up monitoring and logging

EOF

echo ""
echo "✅ Deployment package created successfully!"
echo ""
echo "📦 Package location: $DEPLOY_DIR"
echo ""
echo "Next steps:"
echo "1. Copy the package directory to your server"
echo "2. Edit config.js with your server details"
echo "3. Run ./start-api-server.sh"
echo "4. Run ./start-web-server.sh"
echo "5. Access at http://your-server-ip:9090"
echo ""

# Made with Bob
