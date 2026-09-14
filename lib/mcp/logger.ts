/**
 * Logging helper for MCP server operations.
 * In stdio mode, logs MUST be directed to stderr to avoid corrupting JSON-RPC on stdout.
 */

export function logInfo(message: string, ...args: unknown[]) {
  const timestamp = new Date().toISOString();
  const formatted = `[navya-mcp:INFO ${timestamp}] ${message}`;
  if (process.env.MCP_STDIO === "true") {
    process.stderr.write(formatted + (args.length ? " " + JSON.stringify(args) : "") + "\n");
  } else {
    console.log(formatted, ...args);
  }
}

export function logWarn(message: string, ...args: unknown[]) {
  const timestamp = new Date().toISOString();
  const formatted = `[navya-mcp:WARN ${timestamp}] ${message}`;
  if (process.env.MCP_STDIO === "true") {
    process.stderr.write(formatted + (args.length ? " " + JSON.stringify(args) : "") + "\n");
  } else {
    console.warn(formatted, ...args);
  }
}

export function logError(message: string, ...args: unknown[]) {
  const timestamp = new Date().toISOString();
  const formatted = `[navya-mcp:ERROR ${timestamp}] ${message}`;
  if (process.env.MCP_STDIO === "true") {
    process.stderr.write(formatted + (args.length ? " " + JSON.stringify(args) : "") + "\n");
  } else {
    console.error(formatted, ...args);
  }
}
