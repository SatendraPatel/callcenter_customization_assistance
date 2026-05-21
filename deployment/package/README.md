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

