#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load guides index
const guidesIndexPath = join(__dirname, "guides", "index.json");
const guidesIndex = JSON.parse(readFileSync(guidesIndexPath, "utf-8"));

// Helper function to load a guide
function loadGuide(guideId: string): any {
  const guidePath = join(__dirname, "guides", `${guideId}.json`);
  try {
    return JSON.parse(readFileSync(guidePath, "utf-8"));
  } catch (error) {
    return null;
  }
}

// Helper function to format guide as HTML
function formatGuideAsHTML(guide: any): string {
  let html = `<strong>${guide.icon || ""} ${guide.title}</strong><br><br>`;

  if (guide.overview) {
    html += `<strong>📋 Overview:</strong><br>${guide.overview}<br><br>`;
  }

  if (guide.example) {
    html += `<strong>Example: ${guide.example}</strong><br><br>`;
  }

  if (guide.steps && Array.isArray(guide.steps)) {
    guide.steps.forEach((step: any) => {
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
        step.items.forEach((item: string) => {
          html += `• ${item}<br>`;
        });
      }

      if (step.code) {
        html += `<pre>${step.code}</pre>`;
      }

      if (step.warning) {
        html += `<div class="warning">${step.warning}</div>`;
      }

      html += `<br>`;
    });
  }

  if (guide.keyPoints && Array.isArray(guide.keyPoints)) {
    html += `<strong>💡 Key Points:</strong><br>`;
    guide.keyPoints.forEach((point: string) => {
      html += `• ${point}<br>`;
    });
    html += `<br>`;
  }

  if (guide.commonActions && Array.isArray(guide.commonActions)) {
    html += `<strong>📚 Common Actions to Customize:</strong><br>`;
    guide.commonActions.forEach((action: string) => {
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

// Create server instance
const server = new Server(
  {
    name: "oms-callcenter-guides",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    {
      name: "list_guides",
      description: "List all available OMS Call Center customization guides",
      inputSchema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Filter by category (customization, actions, mashup, setup)",
            enum: ["customization", "actions", "mashup", "setup"],
          },
        },
      },
    },
    {
      name: "get_guide",
      description: "Get a specific customization guide by ID or search term",
      inputSchema: {
        type: "object",
        properties: {
          guide_id: {
            type: "string",
            description: "The ID of the guide to retrieve",
          },
          search: {
            type: "string",
            description: "Search term to find relevant guides",
          },
        },
      },
    },
    {
      name: "search_guides",
      description: "Search for guides by keywords",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query",
          },
        },
        required: ["query"],
      },
    },
  ];

  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "list_guides") {
      const category = args?.category as string | undefined;
      let guides = guidesIndex.guides;

      if (category) {
        guides = guides.filter((g: any) => g.category === category);
      }

      const guideList = guides
        .map((g: any) => `${g.icon} **${g.name}** (${g.id})`)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Available guides:\n\n${guideList}`,
          },
        ],
      };
    }

    if (name === "get_guide") {
      const guideId = args?.guide_id as string | undefined;
      const search = args?.search as string | undefined;

      let targetGuideId = guideId;

      // If search term provided, find matching guide
      if (search && !guideId) {
        const searchLower = search.toLowerCase();
        const matchingGuide = guidesIndex.guides.find((g: any) =>
          g.keywords.some((k: string) => searchLower.includes(k.toLowerCase())) ||
          g.name.toLowerCase().includes(searchLower) ||
          g.id.toLowerCase().includes(searchLower)
        );

        if (matchingGuide) {
          targetGuideId = matchingGuide.id;
        }
      }

      if (!targetGuideId) {
        return {
          content: [
            {
              type: "text",
              text: "Guide not found. Use list_guides to see available guides.",
            },
          ],
        };
      }

      const guide = loadGuide(targetGuideId);

      if (!guide) {
        return {
          content: [
            {
              type: "text",
              text: `Guide '${targetGuideId}' not found or not yet implemented.`,
            },
          ],
        };
      }

      const html = formatGuideAsHTML(guide);

      return {
        content: [
          {
            type: "text",
            text: html,
          },
        ],
      };
    }

    if (name === "search_guides") {
      const query = (args?.query as string || "").toLowerCase();

      const matchingGuides = guidesIndex.guides.filter((g: any) =>
        g.keywords.some((k: string) => k.toLowerCase().includes(query)) ||
        g.name.toLowerCase().includes(query) ||
        g.id.toLowerCase().includes(query)
      );

      if (matchingGuides.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No guides found matching '${query}'. Use list_guides to see all available guides.`,
            },
          ],
        };
      }

      const results = matchingGuides
        .map((g: any) => `${g.icon} **${g.name}** (${g.id})`)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Found ${matchingGuides.length} guide(s):\n\n${results}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Unknown tool: ${name}`,
        },
      ],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OMS Call Center Guides MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

// Made with Bob
