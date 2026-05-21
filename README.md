# Call Center Customization Assistance - Standalone API

A standalone HTTP API server that provides customization guides for IBM Sterling Call Center. This solution works independently without requiring Bob or any LLM infrastructure.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Chatbot UI)                      │
│  /Users/satendrapatel/Documents/OMS/DTK2506/                │
│  CallCenterCode_2506/callcenter-code/                       │
│  oms-chatbot-ui-watsonx.html                                │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP Fetch API
                     │ (localhost:3000)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Standalone API Server (Express.js)              │
│  /Users/satendrapatel/Documents/Projects/                   │
│  callcenter-customization-assistance/api-server/            │
│                                                              │
│  Endpoints:                                                  │
│  - GET /api/health                                          │
│  - GET /api/guides                                          │
│  - GET /api/guides/:id                                      │
│  - GET /api/guides/:id/html                                 │
│  - GET /api/guides/search/:query                            │
└────────────────────┬────────────────────────────────────────┘
                     │ Read JSON files
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Guide Data (JSON)                         │
│  /Users/satendrapatel/Documents/Projects/                   │
│  callcenter-customization-assistance/mcp-server/            │
│  src/guides/*.json                                          │
│                                                              │
│  - config-customization.json                                │
│  - customize-existing-action.json                           │
│  - index.json                                               │
└─────────────────────────────────────────────────────────────┘
```

## Features

- ✅ **Standalone**: No Bob or LLM required
- ✅ **Lightweight**: Simple Express.js server
- ✅ **Fast**: Direct JSON file serving
- ✅ **CORS Enabled**: Works from browser
- ✅ **HTML Formatting**: Automatic guide formatting
- ✅ **Search**: Query guides by keyword
- ✅ **Easy Startup**: Single script to launch

## Quick Start

### 1. Start the API Server

```bash
cd /Users/satendrapatel/Documents/Projects/callcenter-customization-assistance
./start-api-server.sh
```

The server will start on `http://localhost:3000`

### 2. Open the Chatbot

Open in browser:
```
file:///Users/satendrapatel/Documents/OMS/DTK2506/CallCenterCode_2506/callcenter-code/oms-chatbot-ui-watsonx.html
```

### 3. Use the Chatbot

Click on "Actions Customization" menu and select any guide. The chatbot will fetch the guide from the API server and display it.

## Project Structure

```
callcenter-customization-assistance/
├── api-server/                    # Standalone HTTP API server
│   ├── server.js                  # Express.js server
│   ├── package.json               # Dependencies
│   └── node_modules/              # Installed packages
├── mcp-server/                    # MCP server (alternative, not used)
│   └── src/
│       └── guides/                # Guide data (JSON files)
│           ├── index.json         # Guide index
│           ├── config-customization.json
│           └── customize-existing-action.json
├── start-api-server.sh            # Startup script
├── README.md                      # This file
└── ARCHITECTURE_OPTIONS.md        # Architecture comparison

callcenter-code/                   # Chatbot UI (separate location)
├── oms-chatbot-ui-watsonx.html   # Main HTML file
├── js/
│   ├── api-client.js             # API client module
│   ├── chat-core.js              # Core chatbot logic
│   ├── chat-responses.js         # Response handlers (uses API)
│   ├── feedback.js               # Feedback system
│   └── admin.js                  # Admin functions
└── css/
    └── chatbot.css               # Styles
```

## API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

### List All Guides
```bash
curl http://localhost:3000/api/guides
```

### Get Guide by ID (JSON)
```bash
curl http://localhost:3000/api/guides/config-customization
```

### Get Guide as HTML
```bash
curl http://localhost:3000/api/guides/config-customization/html
```

### Search Guides
```bash
curl http://localhost:3000/api/guides/search/action
```

## How It Works

1. **API Server**: Express.js server reads JSON guide files and serves them via REST endpoints
2. **API Client**: JavaScript module (`api-client.js`) provides functions to call the API
3. **Chatbot**: Uses async/await to fetch guides from API and display them
4. **No LLM**: Chatbot is rule-based, just displays static guides - no AI processing needed

## Adding New Guides

1. Create a new JSON file in `mcp-server/src/guides/`
2. Follow the existing format:
```json
{
  "id": "your-guide-id",
  "title": "Your Guide Title",
  "category": "customization",
  "description": "Brief description",
  "content": {
    "overview": "Overview text",
    "steps": [
      {
        "number": 1,
        "title": "Step Title",
        "description": "Step description",
        "code": "Optional code example"
      }
    ],
    "keyPoints": ["Point 1", "Point 2"],
    "commonActions": ["Action 1", "Action 2"]
  }
}
```
3. Add entry to `index.json`
4. Restart API server
5. Update chatbot menu if needed

## Troubleshooting

### API Server Not Starting
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Restart server
./start-api-server.sh
```

### Chatbot Not Loading Guides
1. Check browser console for errors (F12)
2. Verify API server is running: `curl http://localhost:3000/api/health`
3. Check CORS is enabled in server.js
4. Verify api-client.js is loaded in HTML

### Guide Not Found
1. Check guide ID matches filename (without .json)
2. Verify guide is listed in `index.json`
3. Check JSON syntax is valid

## Development

### Install Dependencies
```bash
cd api-server
npm install
```

### Run in Development Mode
```bash
cd api-server
npm run dev  # Uses nodemon for auto-reload
```

### Test API
```bash
# Test all endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/guides
curl http://localhost:3000/api/guides/config-customization
curl http://localhost:3000/api/guides/config-customization/html
curl http://localhost:3000/api/guides/search/action
```

## Alternative: MCP Server

An MCP server implementation is also available in `mcp-server/` directory. This requires Bob to be running and is configured in Bob's MCP settings. Use this if you want to integrate with Bob's ecosystem.

See `ARCHITECTURE_OPTIONS.md` for comparison between standalone and MCP approaches.

## Benefits of Standalone Approach

1. **No Dependencies**: Works without Bob or LLM infrastructure
2. **Fast**: Direct file serving, no processing overhead
3. **Simple**: Easy to understand and maintain
4. **Portable**: Can be deployed anywhere Node.js runs
5. **Scalable**: Can add more guides without complexity

## License

Internal IBM Sterling OMS customization tool.