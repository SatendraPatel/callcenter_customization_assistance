import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for browser access
app.use(cors());
app.use(express.json());

// ============================================================
// Automatic Visitor Tracking Middleware
// ============================================================
app.use((req, res, next) => {
  // Skip logging for admin-related paths only
  const skipPaths = [
    '/health',
    '/api/visitors',
    '/api/visitors/clear',
    '/api/feedback',
    '/api/feedback/clear'
  ];
  
  // Only skip if path exactly matches (not startsWith)
  const shouldSkip = skipPaths.includes(req.path);
  
  if (!shouldSkip) {
    logVisitor(req);
  }
  
  next();
});

// ============================================================
// SQLite Database Setup
// ============================================================
const DB_FILE = join(__dirname, 'oms-chatbot.db');
const db = new Database(DB_FILE);

// Create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
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
        org TEXT,
        username TEXT
    );

    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        msg_id TEXT NOT NULL,
        reaction TEXT NOT NULL,
        experience TEXT,
        time_saved TEXT,
        comments TEXT,
        timestamp TEXT NOT NULL,
        created_at INTEGER NOT NULL
    );
`);

// Add username column to existing visitors table if it doesn't exist
try {
    db.exec(`ALTER TABLE visitors ADD COLUMN username TEXT`);
    console.log('✅ Added username column to visitors table');
} catch (e) {
    // Column already exists - this is fine
    if (e.message.includes('duplicate column name')) {
        console.log('ℹ️  Username column already exists');
    } else {
        console.error('⚠️  Error adding username column:', e.message);
    }
}

console.log('📊 Visitor tracking middleware: ACTIVE');
console.log('🚫 Skipping paths:', ['/health', '/api/visitors', '/api/visitors/clear', '/api/feedback', '/api/feedback/clear']);

console.log('✅ SQLite database initialized:', DB_FILE);

// ============================================================
// Geolocation Helper
// ============================================================
function getGeoLocation(ip, callback) {
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === 'Unknown') {
        callback({ country: 'Local', city: 'Localhost', region: '-', isp: '-', org: '-', countryCode: '-' });
        return;
    }

    const apiUrl = `http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,isp,org`;

    http.get(apiUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const geo = JSON.parse(data);
                if (geo.status === 'success') {
                    callback({
                        country: geo.country || '-',
                        countryCode: geo.countryCode || '-',
                        region: geo.regionName || '-',
                        city: geo.city || '-',
                        isp: geo.isp || '-',
                        org: geo.org || '-'
                    });
                } else {
                    callback({ country: '-', city: '-', region: '-', isp: '-', org: '-', countryCode: '-' });
                }
            } catch (e) {
                callback({ country: '-', city: '-', region: '-', isp: '-', org: '-', countryCode: '-' });
            }
        });
    }).on('error', () => {
        callback({ country: '-', city: '-', region: '-', isp: '-', org: '-', countryCode: '-' });
    });
}

// ============================================================
// Visitor Logging
// ============================================================
const insertVisitor = db.prepare(`
    INSERT INTO visitors (ip, time, timestamp, user_agent, path, referer, country, country_code, region, city, isp, org, username)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function logVisitor(req, callback) {
    const ip = req.headers['x-forwarded-for'] ||
               req.connection?.remoteAddress ||
               req.socket?.remoteAddress || 'Unknown';
    const cleanIP = ip.replace('::ffff:', '');
    
    // Extract username from multiple possible sources
    const username = req.headers['x-username'] ||        // Custom header
                     req.query.username ||                // Query parameter
                     req.body?.username ||                // Request body
                     'Anonymous';                         // Default

    getGeoLocation(cleanIP, (geo) => {
        const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const timestamp = Date.now();

        try {
            insertVisitor.run(
                cleanIP, time, timestamp,
                req.headers['user-agent'] || 'Unknown',
                req.url,
                req.headers['referer'] || '-',
                geo.country, geo.countryCode, geo.region, geo.city, geo.isp, geo.org,
                username
            );
        } catch (e) {
            console.error('Error inserting visitor:', e.message);
        }

        const userInfo = username !== 'Anonymous' ? ` [${username}]` : '';
        console.log(`[${time}] ${cleanIP}${userInfo} (${geo.city}, ${geo.country}) - ${req.method} ${req.url}`);
        if (callback) callback({ ip: cleanIP, country: geo.country, city: geo.city, time, username });
    });
}

// Load guides from package guides directory
const guidesPath = join(__dirname, '../guides');

// Helper function to load a guide
function loadGuide(guideId) {
  try {
    const guidePath = join(guidesPath, `${guideId}.json`);
    return JSON.parse(readFileSync(guidePath, 'utf-8'));
  } catch (error) {
    return null;
  }
}

// Helper function to format guide as HTML
function formatGuideAsHTML(guide) {
  let html = `<strong>${guide.icon || ""} ${guide.title}</strong><br><br>`;

  if (guide.overview) {
    html += `<strong>📋 Overview:</strong><br>${guide.overview}<br><br>`;
  }

  if (guide.example) {
    html += `<strong>Example: ${guide.example}</strong><br><br>`;
  }

  if (guide.steps && Array.isArray(guide.steps)) {
    guide.steps.forEach((step) => {
      const emoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"][step.number - 1] || `${step.number}️⃣`;
      html += `<strong>${emoji} ${step.title}</strong><br>`;
      
      if (step.description) {
        html += `${step.description}<br>`;
      }

      if (step.from && step.to) {
        html += `<br><strong>From:</strong><br><code>${step.from}</code><br><br>`;
        html += `<strong>To:</strong><br><code>${step.to}</code><br>`;
      }

      if (step.items && Array.isArray(step.items)) {
        step.items.forEach((item) => {
          html += `• ${item}<br>`;
        });
      }

      if (step.filePath) {
        html += `<br><strong>📁 File Location:</strong><br>${step.filePath}<br><br>`;
      }

      if (step.code) {
        // Escape HTML entities in code blocks
        const escapedCode = step.code
          .replace(/&/g, '&')
          .replace(/</g, '<')
          .replace(/>/g, '>')
          .replace(/"/g, '"')
          .replace(/'/g, '&#039;');
        html += `<pre>${escapedCode}</pre>`;
      }

      if (step.warning) {
        html += `<div class="warning">${step.warning}</div>`;
      }

      html += `<br>`;
    });
  }

  if (guide.keyPoints && Array.isArray(guide.keyPoints)) {
    html += `<strong>💡 Key Points:</strong><br>`;
    guide.keyPoints.forEach((point) => {
      html += `• ${point}<br>`;
    });
    html += `<br>`;
  }

  if (guide.commonActions && Array.isArray(guide.commonActions)) {
    html += `<strong>📚 Common Actions to Customize:</strong><br>`;
    guide.commonActions.forEach((action) => {
      html += `• ${action}<br>`;
    });
    html += `<br>`;
  }

  if (guide.modules && Array.isArray(guide.modules)) {
    html += `<strong>📚 Modules:</strong> ${guide.modules.join(", ")}`;
  }

  html += `<br><em>Need help with something else? Just ask!</em>`;

  return html;
}

// API Routes

// ============================================================
// Visitor & Feedback API Endpoints
// ============================================================

// Track visitor
app.post('/api/track', (req, res) => {
  logVisitor(req, (entry) => {
    res.json({ status: 'ok', ip: entry.ip, country: entry.country, city: entry.city });
  });
});

// Track sidebar action clicks
app.post('/api/track-action', (req, res) => {
  logVisitor(req, (entry) => {
    res.json({ status: 'ok', action: req.body.action, type: req.body.type });
  });
});

// Get all visitors
app.get('/api/visitors', (req, res) => {
  try {
    const visitors = db.prepare('SELECT * FROM visitors ORDER BY timestamp DESC LIMIT 1000').all();
    // Map snake_case to camelCase for frontend compatibility
    const mapped = visitors.map(v => ({
      ip: v.ip,
      time: v.time,
      timestamp: v.timestamp,
      userAgent: v.user_agent,
      path: v.path,
      referer: v.referer,
      country: v.country,
      countryCode: v.country_code,
      region: v.region,
      city: v.city,
      isp: v.isp,
      org: v.org,
      username: v.username
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read visitors' });
  }
});

// Clear visitors
app.post('/api/visitors/clear', (req, res) => {
  try {
    db.prepare('DELETE FROM visitors').run();
    res.json({ status: 'cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear visitors' });
  }
});

// Save feedback
app.post('/api/feedback', (req, res) => {
  try {
    const data = req.body;
    // Remove existing feedback for this msgId (upsert)
    db.prepare('DELETE FROM feedback WHERE msg_id = ?').run(data.msgId);
    db.prepare(`
      INSERT INTO feedback (msg_id, reaction, experience, time_saved, comments, timestamp, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.msgId,
      data.reaction,
      data.experience || null,
      data.timeSaved || '0',
      data.comments || null,
      data.timestamp || new Date().toISOString(),
      Date.now()
    );
    res.json({ status: 'saved' });
  } catch (error) {
    console.error('Error saving feedback:', error.message);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Get all feedback
app.get('/api/feedback', (req, res) => {
  try {
    const feedbacks = db.prepare('SELECT * FROM feedback ORDER BY created_at ASC').all();
    const mapped = feedbacks.map(f => ({
      msgId: f.msg_id,
      reaction: f.reaction,
      experience: f.experience,
      timeSaved: f.time_saved,
      comments: f.comments,
      timestamp: f.timestamp
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read feedback' });
  }
});

// Clear feedback
app.post('/api/feedback/clear', (req, res) => {
  try {
    db.prepare('DELETE FROM feedback').run();
    res.json({ status: 'cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear feedback' });
  }
});

// ============================================================
// Guide API Endpoints
// ============================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OMS Call Center Guides API is running' });
});

// List all guides
app.get('/api/guides', (req, res) => {
  try {
    const indexPath = join(guidesPath, 'index.json');
    const guidesIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));
    
    const category = req.query.category;
    let guides = guidesIndex.guides;

    if (category) {
      guides = guides.filter(g => g.category === category);
    }

    res.json({
      success: true,
      count: guides.length,
      guides: guides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific guide by ID
app.get('/api/guides/:id', (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = loadGuide(guideId);

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: `Guide '${guideId}' not found`
      });
    }

    res.json({
      success: true,
      guide: guide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get guide as formatted HTML
app.get('/api/guides/:id/html', (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = loadGuide(guideId);

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: `Guide '${guideId}' not found`
      });
    }

    const html = formatGuideAsHTML(guide);

    res.json({
      success: true,
      html: html
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search guides by keyword
app.get('/api/guides/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const indexPath = join(guidesPath, 'index.json');
    const guidesIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));

    const matchingGuides = guidesIndex.guides.filter(g =>
      g.keywords.some(k => k.toLowerCase().includes(query)) ||
      g.name.toLowerCase().includes(query) ||
      g.id.toLowerCase().includes(query)
    );

    res.json({
      success: true,
      query: query,
      count: matchingGuides.length,
      guides: matchingGuides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OMS Call Center Guides API Server running on http://localhost:${PORT}`);
  console.log(`📚 API Endpoints:`);
  console.log(`   GET  /health                    - Health check`);
  console.log(`   GET  /api/guides                - List all guides`);
  console.log(`   GET  /api/guides?category=X     - List guides by category`);
  console.log(`   GET  /api/guides/:id            - Get guide by ID (JSON)`);
  console.log(`   GET  /api/guides/:id/html       - Get guide as HTML`);
  console.log(`   GET  /api/guides/search/:query  - Search guides`);
  console.log(`\n💡 Try: http://localhost:${PORT}/api/guides`);
});

// Made with Bob
