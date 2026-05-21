# OMS Call Center Customization Assistant - Features

## Overview

This application provides an interactive chatbot interface for IBM Sterling Call Center customization guidance, with built-in feedback collection and visitor analytics.

## Core Features

### 1. Interactive Customization Guides

- **Configuration-based Customization**: Step-by-step guides for customizing Call Center through configuration
- **Component Customization**: Detailed instructions for extending UI components
- **Shared Component Customization**: Guidance on customizing shared components
- **Home Portlet Customization**: Instructions for customizing home portlets
- **Mashup Extensions**: Complete guides for creating and managing mashup extensions
- **Troubleshooting Guides**: Solutions for common issues (accessible via chat only)

### 2. User Feedback System

The application includes a comprehensive feedback system that allows users to rate responses and provide comments.

#### Feedback Features:
- **Like/Dislike Buttons**: Users can rate each bot response
- **Time Saved Tracking**: Users can report how much time the guide saved them
- **Comments**: Users can provide detailed feedback on responses
- **Improvement Suggestions**: For dislikes, users can suggest improvements

#### How It Works:
1. Each bot message includes 👍 Like and 👎 Dislike buttons
2. Clicking Like allows users to:
   - Enter time saved (in minutes)
   - Add optional comments
3. Clicking Dislike allows users to:
   - Provide improvement suggestions (required)
4. All feedback is stored in SQLite database
5. Admins can view feedback analytics in Admin Panel

### 3. Visitor Tracking & Analytics

The application automatically tracks visitor information for analytics purposes.

#### Tracked Information:
- **IP Address**: Visitor's IP address
- **Location**: City, region, and country (via IP geolocation)
- **Visit Time**: Timestamp of each visit
- **User Agent**: Browser and device information
- **ISP/Organization**: Internet service provider details
- **Page Path**: Which pages were accessed
- **Referer**: Where visitors came from

#### Privacy Notes:
- Tracking is automatic and anonymous
- No personal information is collected
- Data is stored locally in SQLite database
- Admins can clear data at any time

### 4. Admin Panel

Access comprehensive analytics and manage data through the Admin Panel.

#### Access Admin Panel:
1. Type "admin" in the chat
2. Enter password: `2026`
3. View analytics dashboard

#### Admin Panel Features:

**Visitor Analytics:**
- Total visits count
- Unique IP addresses
- Recent visitors (last 100)
- Geographic distribution
- Browser/device statistics
- Full visitor history table

**Feedback Analytics:**
- Total likes and dislikes
- Average time saved
- Detailed feedback table with:
  - Reaction (like/dislike)
  - Time saved
  - Comments
  - Submission timestamp

**Data Management:**
- Clear visitor data
- Clear feedback data
- Export capabilities (via database file)

### 5. Database Storage

All data is stored in SQLite database (`oms-chatbot.db`).

#### Database Schema:

**visitors table:**
```sql
CREATE TABLE visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    time TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    user_agent TEXT,
    path TEXT,
    referer TEXT,
    country TEXT,
    country_code TEXT,
    region TEXT,
    city TEXT,
    isp TEXT,
    org TEXT
);
```

**feedback table:**
```sql
CREATE TABLE feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    msg_id TEXT NOT NULL,
    reaction TEXT NOT NULL,
    experience TEXT,
    time_saved TEXT,
    comments TEXT,
    timestamp TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
```

## API Endpoints

### Visitor Tracking Endpoints

- `POST /api/track` - Track a visitor
- `GET /api/visitors` - Get all visitors
- `POST /api/visitors/clear` - Clear visitor data

### Feedback Endpoints

- `POST /api/feedback` - Save feedback
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback/clear` - Clear feedback data

### Guide Endpoints

- `GET /health` - Health check
- `GET /api/guides` - List all guides
- `GET /api/guides?category=X` - List guides by category
- `GET /api/guides/:id` - Get guide by ID (JSON)
- `GET /api/guides/:id/html` - Get guide as HTML
- `GET /api/guides/search/:query` - Search guides

## Configuration

### Enable/Disable Features

Edit `api-server/server.js` to customize:

**Disable Visitor Tracking:**
```javascript
// Comment out visitor tracking in server
// logVisitor(req, null);
```

**Disable Feedback:**
```javascript
// Remove feedback buttons from chat-core.js
// Or modify feedback.js to disable submission
```

**Change Admin Password:**
```javascript
// In admin.js, line 25:
if (pwd !== '2026') {  // Change '2026' to your password
```

## Data Privacy & Compliance

### GDPR Compliance

If deploying in EU:
1. Add privacy policy explaining data collection
2. Implement cookie consent banner
3. Provide data export functionality
4. Allow users to request data deletion
5. Document data retention policies

### Data Retention

By default, data is retained indefinitely. To implement retention:

```javascript
// Add to server.js - Delete old data (e.g., 90 days)
const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
db.prepare('DELETE FROM visitors WHERE timestamp < ?').run(ninetyDaysAgo);
db.prepare('DELETE FROM feedback WHERE created_at < ?').run(ninetyDaysAgo);
```

## Backup & Recovery

### Backup Database

```bash
# Copy database file
cp api-server/oms-chatbot.db api-server/oms-chatbot.db.backup

# Or use SQLite backup command
sqlite3 api-server/oms-chatbot.db ".backup api-server/backup.db"
```

### Restore Database

```bash
# Replace current database
cp api-server/backup.db api-server/oms-chatbot.db

# Restart API server
pm2 restart oms-api-server
```

### Export Data

```bash
# Export visitors to CSV
sqlite3 -header -csv api-server/oms-chatbot.db "SELECT * FROM visitors;" > visitors.csv

# Export feedback to CSV
sqlite3 -header -csv api-server/oms-chatbot.db "SELECT * FROM feedback;" > feedback.csv
```

## Performance Considerations

### Database Size

- Visitors table: ~500 bytes per record
- Feedback table: ~300 bytes per record
- 10,000 visitors ≈ 5 MB
- 1,000 feedback entries ≈ 300 KB

### Optimization Tips

1. **Regular Cleanup**: Clear old data periodically
2. **Indexing**: Add indexes for frequently queried columns
3. **Archiving**: Move old data to archive tables
4. **Monitoring**: Track database size and query performance

```sql
-- Add indexes for better performance
CREATE INDEX idx_visitors_timestamp ON visitors(timestamp);
CREATE INDEX idx_visitors_ip ON visitors(ip);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
```

## Troubleshooting

### Database Locked Error

```bash
# Check for processes using database
lsof api-server/oms-chatbot.db

# Restart API server
pm2 restart oms-api-server
```

### Missing Feedback Buttons

1. Verify `feedback.js` is loaded in HTML
2. Check browser console for errors
3. Ensure API server is running
4. Test API endpoint: `curl http://localhost:5000/api/feedback`

### Visitor Tracking Not Working

1. Check API server logs
2. Verify geolocation API is accessible
3. Test tracking endpoint: `curl -X POST http://localhost:5000/api/track`
4. Check firewall allows outbound HTTP to ip-api.com

## Future Enhancements

Potential features to add:

1. **Export Reports**: Generate PDF/Excel reports from analytics
2. **Email Notifications**: Alert admins of new feedback
3. **Advanced Analytics**: Charts, graphs, trends
4. **User Sessions**: Track user journeys through guides
5. **A/B Testing**: Test different guide formats
6. **Search Analytics**: Track what users search for
7. **Response Time**: Measure how long users spend on guides
8. **Integration**: Connect to external analytics platforms

## Support

For issues or questions:
1. Check logs: `pm2 logs oms-api-server`
2. Review database: `sqlite3 api-server/oms-chatbot.db`
3. Test API endpoints with curl
4. Check browser console for frontend errors

---

**Note**: This application is designed for internal use. For public deployment, implement proper security measures including authentication, rate limiting, and data encryption.