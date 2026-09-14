#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createNavyaMcpServer } from "../lib/mcp/server";
import { logInfo, logError } from "../lib/mcp/logger";

process.env.MCP_STDIO = "true";

async function main() {
  try {
    logInfo("Starting Navya Computech MCP CLI Stdio Server...");
    const server = createNavyaMcpServer();
    const transport = new StdioServerTransport();

    await server.connect(transport);
    logInfo("Navya Computech MCP Server connected to stdio transport and listening.");

    const shutdown = async () => {
      logInfo("Shutting down MCP Stdio Server...");
      await server.close();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err: unknown) {
    logError("Fatal error starting MCP Stdio Server:", err);
    process.exit(1);
  }
}

main();
