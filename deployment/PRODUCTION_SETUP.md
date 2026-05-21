# Production Setup Guide - Always Running Servers

This guide shows you how to set up the OMS Call Center Customization Assistant to run permanently on your server, with automatic restart on crashes and system reboots.

## Overview

We use **PM2** (Process Manager 2) to:
- ✅ Keep servers running 24/7
- ✅ Auto-restart on crashes
- ✅ Start automatically on system boot
- ✅ Monitor resource usage
- ✅ Manage logs
- ✅ Zero-downtime restarts

## Quick Setup (Automated)

### Step 1: Transfer Package to Server

```bash
# From your local machine
scp -r package/ user@your-server-ip:/home/user/oms-assistant/
```

### Step 2: Configure Server Details

SSH into your server and edit config.js:

```bash
ssh user@your-server-ip
cd /home/user/oms-assistant
nano config.js
```

Update with your server IP:
```javascript
api: {
    host: '192.168.1.100',  // Your server IP
    port: 5000,
    protocol: 'http'
},
web: {
    host: '192.168.1.100',  // Your server IP
    port: 9090,
    protocol: 'http'
}
```

### Step 3: Run Production Setup Script

```bash
chmod +x setup-production.sh
./setup-production.sh
```

This script will:
1. Install PM2 (if not installed)
2. Install dependencies
3. Start both servers
4. Configure auto-start on boot
5. Save configuration

### Step 4: Enable Startup on Boot

Run the command shown at the end of setup script (as root):

```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $(whoami) --hp $HOME
```

### Step 5: Configure Firewall

```bash
# Ubuntu/Debian
sudo ufw allow 5000/tcp
sudo ufw allow 9090/tcp
sudo ufw reload

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --permanent --add-port=9090/tcp
sudo firewall-cmd --reload
```

### Step 6: Verify Services

```bash
pm2 status
```

You should see:
```
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ status  │ restart │ uptime   │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ oms-api-server   │ online  │ 0       │ 5s       │
│ 1   │ oms-web-server   │ online  │ 0       │ 5s       │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

## Manual Setup (Step-by-Step)

If you prefer manual setup:

### 1. Install PM2

```bash
sudo npm install -g pm2
```

### 2. Install Dependencies

```bash
cd /home/user/oms-assistant
cd api-server && npm install && cd ..
```

### 3. Create Logs Directory

```bash
mkdir -p logs
```

### 4. Start Services with PM2

```bash
# Start API server
pm2 start api-server/server.js --name oms-api-server

# Start web server
pm2 start --name oms-web-server --interpreter python3 -- -m http.server 9090 --directory web
```

### 5. Save PM2 Configuration

```bash
pm2 save
```

### 6. Enable Startup on Boot

```bash
pm2 startup
# Follow the instructions shown
```

## PM2 Management Commands

### View Status

```bash
pm2 status              # List all processes
pm2 show oms-api-server # Detailed info for API server
pm2 show oms-web-server # Detailed info for web server
```

### View Logs

```bash
pm2 logs                    # All logs (live)
pm2 logs oms-api-server     # API server logs only
pm2 logs oms-web-server     # Web server logs only
pm2 logs --lines 100        # Last 100 lines
```

### Restart Services

```bash
pm2 restart all             # Restart all services
pm2 restart oms-api-server  # Restart API server only
pm2 restart oms-web-server  # Restart web server only
pm2 reload all              # Zero-downtime restart
```

### Stop Services

```bash
pm2 stop all                # Stop all services
pm2 stop oms-api-server     # Stop API server only
pm2 delete all              # Remove all from PM2
```

### Monitor Resources

```bash
pm2 monit                   # Real-time monitoring
pm2 list                    # Process list with stats
```

### Update Application

```bash
# 1. Upload new files
scp -r package/* user@server:/home/user/oms-assistant/

# 2. Restart services
pm2 restart all

# Or for zero-downtime:
pm2 reload all
```

## Using PM2 Ecosystem File

The package includes `pm2-ecosystem.config.js` for advanced configuration:

```bash
# Start using ecosystem file
pm2 start pm2-ecosystem.config.js

# This configures:
# - Auto-restart on crash
# - Memory limits
# - Log rotation
# - Environment variables
```

## Troubleshooting

### Services Not Starting

```bash
# Check PM2 logs
pm2 logs

# Check if ports are in use
sudo lsof -i :5000
sudo lsof -i :9090

# Restart PM2
pm2 kill
pm2 resurrect
```

### Services Not Starting on Boot

```bash
# Re-run startup command
pm2 startup

# Verify systemd service
sudo systemctl status pm2-$(whoami)

# Enable service
sudo systemctl enable pm2-$(whoami)
```

### High Memory Usage

```bash
# Check memory usage
pm2 list

# Restart service
pm2 restart oms-api-server

# Set memory limit in ecosystem file
max_memory_restart: '500M'
```

### Logs Growing Too Large

```bash
# Install log rotation
pm2 install pm2-logrotate

# Configure rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

## Monitoring & Maintenance

### Daily Checks

```bash
# Quick status check
pm2 status

# Check logs for errors
pm2 logs --lines 50 --err
```

### Weekly Maintenance

```bash
# Review logs
pm2 logs --lines 1000

# Check resource usage
pm2 monit

# Restart if needed
pm2 restart all
```

### Monthly Tasks

```bash
# Update PM2
sudo npm update -g pm2

# Update dependencies
cd api-server && npm update && cd ..

# Restart services
pm2 restart all
```

## Advanced Configuration

### Environment Variables

Edit `pm2-ecosystem.config.js`:

```javascript
env: {
    NODE_ENV: 'production',
    PORT: 5000,
    LOG_LEVEL: 'info'
}
```

### Multiple Instances (Load Balancing)

```javascript
instances: 2,  // Run 2 instances
exec_mode: 'cluster'
```

### Custom Log Files

```javascript
error_file: '/var/log/oms/api-error.log',
out_file: '/var/log/oms/api-out.log'
```

## Security Considerations

1. **Run as non-root user**
   ```bash
   # Create dedicated user
   sudo useradd -m -s /bin/bash omsapp
   sudo su - omsapp
   ```

2. **Use HTTPS** (see DEPLOYMENT_GUIDE.md)

3. **Configure firewall** to allow only necessary ports

4. **Regular updates**
   ```bash
   npm update
   pm2 update
   ```

5. **Monitor logs** for suspicious activity
   ```bash
   pm2 logs | grep -i error
   ```

## Backup & Recovery

### Backup PM2 Configuration

```bash
# Save current state
pm2 save

# Backup file location
~/.pm2/dump.pm2
```

### Restore After System Crash

```bash
# PM2 will auto-restore on boot
# Or manually:
pm2 resurrect
```

### Complete Backup

```bash
# Backup entire application
tar -czf oms-assistant-backup.tar.gz /home/user/oms-assistant
```

## Performance Tuning

### Optimize Node.js

```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=2048" pm2 restart oms-api-server
```

### Monitor Performance

```bash
# Real-time monitoring
pm2 monit

# Generate report
pm2 report
```

## Support

For issues:
1. Check PM2 logs: `pm2 logs`
2. Check system logs: `journalctl -u pm2-$(whoami)`
3. Review this guide
4. Contact system administrator

---

**Last Updated:** $(date)
**PM2 Version:** $(pm2 --version 2>/dev/null || echo "Not installed")