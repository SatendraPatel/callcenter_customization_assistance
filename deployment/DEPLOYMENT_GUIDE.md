# OMS Call Center Customization Assistant - Complete Deployment Guide

## Overview

This guide will help you deploy the OMS Call Center Customization Assistant to a remote server so other users can access it.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Users' Browsers                       │
│              (Access via http://server-ip:8080)          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Web Server (Port 8080)                      │
│         Serves: HTML, CSS, JavaScript, Images            │
└────────────────────┬────────────────────────────────────┘
                     │ Fetch API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              API Server (Port 3000)                      │
│         Express.js - Serves Guide Data (JSON)            │
└────────────────────┬────────────────────────────────────┘
                     │ Read Files
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Guide Data (JSON)                       │
│              Troubleshooting & How-To Guides             │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

### On Your Local Machine
- Access to the deployment package
- SSH access to target server
- SCP or similar file transfer tool

### On Target Server
- Linux/Unix operating system (Ubuntu, CentOS, RHEL, etc.)
- Node.js 18 or later
- Python 3 (for simple web server) OR nginx/Apache
- Ports 3000 and 8080 available (or configure different ports)
- Firewall configured to allow incoming connections

## Step-by-Step Deployment

### Step 1: Create Deployment Package

On your local machine:

```bash
cd /Users/satendrapatel/Documents/Projects/callcenter-customization-assistance/deployment
./deploy.sh
```

This creates a `package` directory with all necessary files.

### Step 2: Configure Server Details

Edit `package/config.js` with your server details:

```javascript
const DEPLOYMENT_CONFIG = {
    api: {
        host: '192.168.1.100',  // Your server IP or domain
        port: 3000,
        protocol: 'http'        // Use 'https' if you have SSL
    },
    web: {
        host: '192.168.1.100',  // Your server IP or domain
        port: 8080,
        protocol: 'http'        // Use 'https' if you have SSL
    }
};
```

**Important:** Replace `192.168.1.100` with your actual server IP address or domain name.

### Step 3: Transfer Package to Server

```bash
# Using SCP
scp -r package/ user@your-server-ip:/home/user/oms-assistant/

# Or using rsync
rsync -avz package/ user@your-server-ip:/home/user/oms-assistant/
```

### Step 4: Install Dependencies on Server

SSH into your server:

```bash
ssh user@your-server-ip
cd /home/user/oms-assistant
```

Install Node.js dependencies:

```bash
cd api-server
npm install
cd ..
```

### Step 5: Configure Firewall

Allow incoming connections on ports 3000 and 8080:

```bash
# For Ubuntu/Debian with UFW
sudo ufw allow 3000/tcp
sudo ufw allow 8080/tcp
sudo ufw reload

# For CentOS/RHEL with firewalld
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### Step 6: Start the Services

#### Option A: Manual Start (for testing)

Terminal 1 - Start API Server:
```bash
cd /home/user/oms-assistant
./start-api-server.sh
```

Terminal 2 - Start Web Server:
```bash
cd /home/user/oms-assistant
./start-web-server.sh
```

#### Option B: Production Start (with PM2)

Install PM2:
```bash
sudo npm install -g pm2
```

Start services:
```bash
cd /home/user/oms-assistant

# Start API server
pm2 start api-server/server.js --name oms-api

# Start web server
pm2 start --name oms-web --interpreter python3 -- -m http.server 8080 --directory web

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### Step 7: Verify Deployment

Test API server:
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","message":"OMS Call Center Guides API is running"}
```

Test web server:
```bash
curl http://localhost:8080
# Should return HTML content
```

### Step 8: Access from Browser

Open in any browser:
```
http://your-server-ip:8080
```

## Production Recommendations

### 1. Use HTTPS

Install SSL certificate and configure nginx as reverse proxy:

```nginx
# /etc/nginx/sites-available/oms-assistant
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Web interface
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Update `config.js`:
```javascript
protocol: 'https'
```

### 2. Set Up Monitoring

```bash
# View PM2 logs
pm2 logs

# Monitor processes
pm2 monit

# View process status
pm2 status
```

### 3. Set Up Log Rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 4. Configure Backup

```bash
# Backup script
#!/bin/bash
BACKUP_DIR="/backup/oms-assistant"
DATE=$(date +%Y%m%d)
tar -czf "$BACKUP_DIR/oms-assistant-$DATE.tar.gz" /home/user/oms-assistant
```

## Troubleshooting

### API Server Won't Start

```bash
# Check if port is in use
sudo lsof -i :3000

# Check logs
pm2 logs oms-api

# Restart service
pm2 restart oms-api
```

### Web Server Won't Start

```bash
# Check if port is in use
sudo lsof -i :8080

# Try different port
cd web && python3 -m http.server 9090
```

### Cannot Access from Browser

1. **Check firewall:**
   ```bash
   sudo ufw status
   ```

2. **Check services are running:**
   ```bash
   pm2 status
   ```

3. **Test locally on server:**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:8080
   ```

4. **Check server IP:**
   ```bash
   ip addr show
   ```

### Guides Not Loading

1. **Check API server logs:**
   ```bash
   pm2 logs oms-api
   ```

2. **Verify guide files exist:**
   ```bash
   ls -la guides/
   ```

3. **Test API endpoint:**
   ```bash
   curl http://localhost:3000/api/guides
   ```

4. **Check browser console** (F12) for errors

## Updating the Application

### Update Guide Content

1. Edit JSON files in `guides/` directory
2. Restart API server:
   ```bash
   pm2 restart oms-api
   ```

### Update Web Interface

1. Replace files in `web/` directory
2. Clear browser cache
3. Restart web server:
   ```bash
   pm2 restart oms-web
   ```

### Update API Server

1. Replace `api-server/server.js`
2. Restart API server:
   ```bash
   pm2 restart oms-api
   ```

## Security Considerations

1. **Use HTTPS** in production
2. **Configure firewall** to allow only necessary ports
3. **Keep Node.js updated**
4. **Regular security updates** for OS
5. **Monitor logs** for suspicious activity
6. **Use strong passwords** for server access
7. **Consider VPN** for internal-only access

## Support

For issues or questions:
1. Check logs: `pm2 logs`
2. Review this guide
3. Contact system administrator

## Maintenance Schedule

- **Daily:** Check service status
- **Weekly:** Review logs
- **Monthly:** Update dependencies
- **Quarterly:** Security audit

---

**Deployment Package Created:** $(date)
**Version:** 1.0.0