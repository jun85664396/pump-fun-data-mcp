#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolResult,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// Define the tools once to avoid repetition
const TOOLS: Tool[] = [
    {
        name: "get_featured_coins",
        description: "Get a list of featured coins",
        inputSchema: {
            type: "object",
            properties: {
                offset: { type: "number", description: "The offset to start from (default: 0)", default: 0 },
                limit: { type: "number", description: "The number of coins to return (default: 24)", default: 24 },
                includeNsfw: { type: "boolean", description: "Include NSFW coins (default: true)", default: true },
            }
        },
    },
    {
        name: "get_coins",
        description: "Get a list of coins",
        inputSchema: {
            type: "object",
            properties: {
                offset: { type: "number", description: "The offset to start from (default: 0)", default: 0 },
                limit: { type: "number", description: "The number of coins to return (default: 24)", default: 24 },
                sort: { type: "string", description: "The field to sort by (market_cap, last_trade_timestamp, created_timestamp, last_reply)", default: "market_cap" },
                includeNsfw: { type: "boolean", description: "Include NSFW coins (default: true)", default: true },
                order: { type: "string", description: "The order to sort by (ASC, DESC)", default: "DESC"},

            },
            required: [],
        },
    },
    {
        name: "get_coin_info",
        description: "Get information about a coin",
        inputSchema: {
            type: "object",
            properties: {
                mintId: { type: "string", description: "The mint id of the coin(coin address)" },
            },
            required: ["mintId"],
        },
    }
]

async function fetchPumpFunData(url: string, params: any) {
    const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'origin': 'https://pump.fun',
        'priority': 'u=1, i',
        'referer': 'https://pump.fun/',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    };
    const response = await axios.get(url, { params, headers });
    if (response.status !== 200 || !response.data) {
        throw new Error(`Failed to fetch data: ${response.status}`);
    }
    return response.data;
}

// Global state
const PUMP_FUN_API_URL = 'https://frontend-api-v3.pump.fun';
let url: string;

// Define the function to handle tool calls
export async function handleToolCall(name: string, args: any): Promise<CallToolResult> {
  try{
    switch (name) {
      case "get_featured_coins":
         url = PUMP_FUN_API_URL+'/coins/for-you';
         return {
            content: [{
              type: "text",
              text: JSON.stringify((await fetchPumpFunData(url, args)))
            }],
            isError: false,
        };
      case "get_coins":
          url = PUMP_FUN_API_URL+'/coins';
          return {
            content: [{
              type: "text",
              text: JSON.stringify((await fetchPumpFunData(url, args)))
            }],
            isError: false,
          };
      case "get_coin_info":
          url = PUMP_FUN_API_URL+'/coins/'+args.mintId;
          return {
            content: [{
              type: "text",
              text: JSON.stringify((await fetchPumpFunData(url, {})))
            }],
            isError: false,
          };
      default:
        return {
          content: [{
            type: "text",
            text: `Unknown tool: ${name}`,
          }],
          isError: true,
        };
      }
    } catch (error) {
        console.error(error);
        return {
            content: [
                {
                    type: "text",
                    text: "An error occurred while processing the request",
                },
            ],
            isError: true,
        };
    }
  }

const server = new Server(
    {
      name: "pump-fun-data-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    },
  );
  

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));
  
server.setRequestHandler(CallToolRequestSchema, async (request) =>
  handleToolCall(request.params.name, request.params.arguments ?? {})
);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);
