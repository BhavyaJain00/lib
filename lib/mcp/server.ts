import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools";
import { registerResources } from "./resources";
import { registerPrompts } from "./prompts";
import { logInfo } from "./logger";

/**
 * Creates and initializes the Navya Computech McpServer instance
 * with all 22 tools, 4 resources, and 3 prompts.
 */
export function createNavyaMcpServer(): McpServer {
  logInfo("Configuring Navya Computech MCP Server...");

  const server = new McpServer({
    name: "navya-computech",
    version: "1.0.0",
  });

  registerTools(server);
  registerResources(server);
  registerPrompts(server);

  logInfo("Navya Computech MCP Server successfully configured.");
  return server;
}
