# Deployment Checklist - OMS Call Center Customization Assistant

## Pre-Deployment Verification

### ✅ Files Modified/Added

- [x] **api-server/server.js** - Added SQLite support and feedback/visitor endpoints
- [x] **api-server/package.json** - Added better-sqlite3 dependency
- [x] **deployment/FEATURES.md** - Complete feature documentation
- [x] **deployment/deploy.sh** - Updated to copy FEATURES.md
- [x] **DEPLOYMENT_SUMMARY.md** - Comprehensive deployment guide
- [x] **test-local.sh** - Automated testing script

### ✅ Existing Files (Unchanged - Already Working)

- [x] **oms-chatbot-ui-watsonx.html** - HTML structure with script tags
- [x] **js/chat-core.js** - Core chat functionality
- [x] **js/chat-responses.js** - Response handlers
- [x] **js/feedback.js** - Feedback system (already exists)
- [x] **js/admin.js** - Admin panel (already exists)
- [x] **css/chatbot.css** - Styles (unchanged)

## Deployment Steps for DTK-25031

### Step 1: Backup Current Deployment

```bash
# On server DTK-25031
cd /path/to/deployment
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz api-server/ web/ guides/ config.js pm2-ecosystem.config.js

# Verify backup created
ls -lh backup-*.tar.gz
```

**What's Backed Up:**
- `api-server/` - API server files (being modified)
- `web/` - Web interface files (unchanged but backup for safety)
- `guides/` - Guide data (unchanged but backup for safety)
- `config.js` - Configuration (unchanged but backup for safety)
- `pm2-ecosystem.config.js` - PM2 config (unchanged but backup for safety)

### Step 2: Stop Services

```bash
pm2 stop oms-api-server
# Keep web server running (no changes needed)
```

### Step 3: Update API Server Files

```bash
# Upload new files to server
scp api-server/server.js user@DTK-25031:/path/to/deployment/api-server/
scp api-server/package.json user@DTK-25031:/path/to/deployment/api-server/
```

### Step 4: Install Dependencies

```bash
# On server
cd /path/to/deployment/api-server
npm install better-sqlite3
```

### Step 5: Verify Installation

```bash
# Check if better-sqlite3 installed
ls -la node_modules/better-sqlite3

# Should see directory with compiled binaries
```

### Step 6: Start API Server

```bash
pm2 start oms-api-server
pm2 logs oms-api-server --lines 20
```

### Step 7: Verify Database Created

```bash
# Check for database file
ls -lh api-server/oms-chatbot.db

# Should see file created on first request
```

### Step 8: Test Endpoints

```bash
# Test health
curl http://localhost:5000/health

# Test guides (existing functionality)
curl http://localhost:5000/api/guides

# Test visitor tracking (new)
curl -X POST http://localhost:5000/api/track

# Test feedback (new)
curl http://localhost:5000/api/feedback
```

### Step 9: Test Web Interface

1. Open browser: `http://server-ip:9090`
2. Click any guide - should load normally
3. Check for Like/Dislike buttons on bot messages
4. Submit feedback - should save successfully
5. Type "admin" - enter password "2026"
6. Verify analytics dashboard loads

### Step 10: Monitor Logs

```bash
# Watch for errors
pm2 logs oms-api-server --lines 50

# Check for:
# ✅ "SQLite database initialized"
# ✅ "OMS Call Center Guides API Server running"
# ✅ No error messages
```

## Rollback Plan (If Something Breaks)

### Quick Rollback

```bash
# Stop new version
pm2 stop oms-api-server

# Restore backup
cd /path/to/deployment
tar -xzf backup-YYYYMMDD-HHMMSS.tar.gz

# Restart old version
pm2 start oms-api-server
pm2 logs oms-api-server
```

## What Could Go Wrong & Solutions

### Issue 1: better-sqlite3 Installation Fails

**Symptom**: npm install fails with compilation errors

**Solution**:
```bash
# Install build tools
sudo yum install gcc-c++ make python3

# Retry installation
npm install better-sqlite3
```

### Issue 2: Database Permission Error

**Symptom**: "SQLITE_CANTOPEN: unable to open database file"

**Solution**:
```bash
# Check directory permissions
ls -la api-server/

# Fix permissions
chmod 755 api-server/
```

### Issue 3: Port 5000 Already in Use

**Symptom**: "EADDRINUSE: address already in use"

**Solution**:
```bash
# Check what's using port
lsof -i :5000

# Kill old process
kill -9 <PID>

# Or change port in server.js
```

### Issue 4: Guides Not Loading

**Symptom**: Guides don't display in chatbot

**Solution**:
- This is **existing functionality** - unchanged
- If broken, it was already broken before deployment
- Check: `curl http://localhost:5000/api/guides`
- Verify guides directory exists: `ls -la guides/`

### Issue 5: Feedback Buttons Not Appearing

**Symptom**: No Like/Dislike buttons on messages

**Solution**:
- Check browser console for errors
- Verify feedback.js is loaded: View page source
- Check API server is running: `pm2 status`
- Test endpoint: `curl http://localhost:5000/api/feedback`

### Issue 6: Admin Panel Not Working

**Symptom**: Admin panel doesn't load or shows errors

**Solution**:
- Check admin.js is loaded: View page source
- Verify API endpoints work:
  ```bash
  curl http://localhost:5000/api/visitors
  curl http://localhost:5000/api/feedback
  ```
- Check browser console for errors

## Post-Deployment Verification

### ✅ Checklist

- [ ] API server running: `pm2 status`
- [ ] Database created: `ls api-server/oms-chatbot.db`
- [ ] Health check passes: `curl http://localhost:5000/health`
- [ ] Guides load: Test in browser
- [ ] Feedback buttons appear: Check bot messages
- [ ] Feedback saves: Submit test feedback
- [ ] Admin panel loads: Type "admin", password "2026"
- [ ] Visitor tracking works: Check admin panel shows visitors
- [ ] No errors in logs: `pm2 logs oms-api-server`

## Success Criteria

### All These Should Work:

1. **Existing Functionality (Unchanged)**
   - ✅ Chatbot loads
   - ✅ Sidebar suggestions work
   - ✅ Guides display correctly
   - ✅ Search works
   - ✅ Troubleshooting guides accessible via chat

2. **New Functionality (Added)**
   - ✅ Like/Dislike buttons appear
   - ✅ Feedback form works
   - ✅ Feedback saves to database
   - ✅ Admin panel accessible
   - ✅ Visitor tracking works
   - ✅ Analytics dashboard displays data

## Confidence Level: HIGH ✅

### Why This Deployment is Safe:

1. **No Breaking Changes**
   - All existing endpoints unchanged
   - HTML/CSS/JS files unchanged (except server.js)
   - Guide data unchanged
   - Web server unchanged

2. **Additive Changes Only**
   - New endpoints added (don't affect existing)
   - New dependency added (doesn't conflict)
   - New database created (doesn't affect existing data)
   - New features are optional (app works without them)

3. **Backward Compatible**
   - If feedback.js fails to load, chatbot still works
   - If admin.js fails to load, chatbot still works
   - If database fails, guides still work
   - Existing functionality completely independent

4. **Easy Rollback**
   - Simple file replacement
   - No database migrations
   - No schema changes to existing data
   - PM2 restart restores old version

## Final Recommendation

**SAFE TO DEPLOY** ✅

The changes are:
- Well-isolated
- Additive only
- Backward compatible
- Easy to rollback
- Thoroughly tested locally

Proceed with deployment following the steps above.