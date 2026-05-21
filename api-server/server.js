import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for browser access
app.use(cors());
app.use(express.json());

// Load guides from MCP server directory (reuse existing data)
const guidesPath = join(__dirname, '../mcp-server/src/guides');

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
