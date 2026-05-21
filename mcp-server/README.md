# OMS Call Center Guides MCP Server

This MCP (Model Context Protocol) server provides access to OMS Call Center customization guides through a clean API.

## Features

- **Centralized Guide Management**: All guides stored as JSON files
- **Easy to Update**: Add/modify guides without touching frontend code
- **Search Capabilities**: Find guides by keywords or categories
- **Structured Data**: Consistent format for all guides

## Installation

The server is already built and configured in Bob's MCP settings.

## Available Tools

### 1. `list_guides`
List all available guides, optionally filtered by category.

**Parameters:**
- `category` (optional): Filter by category (customization, actions, mashup, setup)

**Example:**
```json
{
  "category": "actions"
}
```

### 2. `get_guide`
Get a specific guide by ID or search term.

**Parameters:**
- `guide_id` (optional): The ID of the guide
- `search` (optional): Search term to find relevant guide

**Example:**
```json
{
  "guide_id": "customize-existing-action"
}
```

or

```json
{
  "search": "customize action"
}
```

### 3. `search_guides`
Search for guides by keywords.

**Parameters:**
- `query` (required): Search query

**Example:**
```json
{
  "query": "component"
}
```

## Guide Structure

Guides are stored in `src/guides/` as JSON files:

```json
{
  "id": "guide-id",
  "title": "Guide Title",
  "icon": "🔧",
  "overview": "Brief overview",
  "steps": [
    {
      "number": 1,
      "title": "Step Title",
      "description": "Step description",
      "code": "code example",
      "items": ["item 1", "item 2"]
    }
  ],
  "keyPoints": ["point 1", "point 2"],
  "commonActions": ["action 1", "action 2"]
}
```

## Adding New Guides

1. Create a new JSON file in `src/guides/`
2. Add the guide entry to `src/guides/index.json`
3. Rebuild the server: `npm run build`
4. Restart Bob to pick up changes

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run watch
```

## Integration with Chatbot

The chatbot frontend can now call these MCP tools instead of having hardcoded content:

```javascript
// Old way (hardcoded in JavaScript)
function showGuide() {
  addBotMessage(`<hardcoded HTML content>`);
}

// New way (using MCP)
async function showGuide(guideId) {
  const response = await callMCPTool('get_guide', { guide_id: guideId });
  addBotMessage(response.content);
}
```

## Current Guides

- ✅ Configuration Customization
- ✅ Customize Existing Action
- ⏳ Component Customization (to be added)
- ⏳ Shared Component Customization (to be added)
- ⏳ Home Portlet Customization (to be added)
- ⏳ Custom Action with Config (to be added)
- ⏳ Custom Action with Code (to be added)
- ⏳ Incremental Mashup (to be added)
- ⏳ Override Mashup (to be added)
- ⏳ Dev Environment Setup (to be added)

## Benefits of MCP Approach

1. **Separation of Concerns**: Content separated from presentation
2. **Maintainability**: Easy to update guides without touching frontend
3. **Scalability**: Add unlimited guides without bloating JavaScript files
4. **Reusability**: Same guides can be used by multiple frontends
5. **Version Control**: Guide changes tracked separately from code
6. **Testing**: Easier to test guide content independently

## Next Steps

1. Restart Bob to load the new MCP server
2. Update chatbot frontend to use MCP tools
3. Migrate remaining guides from JavaScript to JSON
4. Test integration end-to-end