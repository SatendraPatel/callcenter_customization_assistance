# Quick Start Guide - Call Center Customization Assistant

## 🚀 Getting Started in 3 Steps

### Step 1: Start the API Server

```bash
cd /Users/satendrapatel/Documents/Projects/callcenter-customization-assistance
./start-api-server.sh
```

**Expected Output:**
```
🚀 Starting Call Center Customization API Server...
✅ Starting server on http://localhost:3000

Available endpoints:
  - GET  /api/health          - Health check
  - GET  /api/guides          - List all guides
  - GET  /api/guides/:id      - Get guide by ID
  - GET  /api/guides/:id/html - Get guide as HTML
  - GET  /api/guides/search/:query - Search guides
```

### Step 2: Open the Chatbot

Open this file in your browser:
```
file:///Users/satendrapatel/Documents/OMS/DTK2506/CallCenterCode_2506/callcenter-code/oms-chatbot-ui-watsonx.html
```

### Step 3: Use the Assistant

1. Click on **"Actions Customization"** in the left sidebar
2. Select any guide (e.g., "Customize Existing Action")
3. The guide will be fetched from the API and displayed

## ✅ Verification

Test the API is running:
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","message":"OMS Call Center Guides API is running"}
```

## 🛑 Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

Or find and kill the process:
```bash
lsof -i :3000
kill -9 <PID>
```

## 📁 Project Locations

- **API Server**: `/Users/satendrapatel/Documents/Projects/callcenter-customization-assistance/api-server/`
- **Chatbot UI**: `/Users/satendrapatel/Documents/OMS/DTK2506/CallCenterCode_2506/callcenter-code/`
- **Guide Data**: `/Users/satendrapatel/Documents/Projects/callcenter-customization-assistance/mcp-server/src/guides/`

## 🔧 Troubleshooting

### API Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Try starting again
./start-api-server.sh
```

### Chatbot Not Loading Guides
1. Open browser console (F12)
2. Check for errors
3. Verify API server is running: `curl http://localhost:3000/health`
4. Check CORS is enabled in `api-server/server.js`

### Guide Not Found
1. Check guide exists: `ls mcp-server/src/guides/`
2. Verify guide is in `index.json`
3. Check guide ID matches filename (without .json)

## 📚 Available Guides

- **Configuration Customization** (`config-customization`)
- **Component Customization** (`component-customization`)
- **Shared Component Customization** (`shared-component-customization`)
- **Home Portlet Customization** (`home-portlet-customization`)
- **Customize Existing Action** (`customize-existing-action`)
- **Custom Action with Config** (`custom-action-with-config`)
- **Custom Action with Code** (`custom-action-with-code`)
- **Incremental Mashup** (`incremental-mashup`)
- **Override Mashup** (`override-mashup`)
- **Dev Environment Setup** (`dev-environment-setup`)

## 🎯 Key Features

✅ **Standalone** - No Bob or LLM required  
✅ **Fast** - Direct JSON file serving  
✅ **Simple** - Single script to start  
✅ **Lightweight** - Just Express.js + CORS  
✅ **Extensible** - Easy to add new guides  

## 📖 Full Documentation

See [README.md](README.md) for complete documentation.