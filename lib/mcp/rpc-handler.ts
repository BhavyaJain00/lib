import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createNavyaMcpServer } from "./server";
import { logError, logInfo } from "./logger";

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  timer: NodeJS.Timeout;
}

const pendingRequests = new Map<string | number, PendingRequest>();

let clientTransportInstance: any = null;
let serverInstance: any = null;
let initPromise: Promise<any> | null = null;

async function getClientTransport(): Promise<any> {
  if (clientTransportInstance) {
    return clientTransportInstance;
  }

  if (!initPromise) {
    initPromise = (async () => {
      logInfo("Initializing in-memory MCP server dispatcher...");
      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
      serverInstance = createNavyaMcpServer();
      await serverInstance.connect(serverTransport);
      await clientTransport.start();

      clientTransport.onmessage = (message: any) => {
        if (message && message.id !== undefined && pendingRequests.has(message.id)) {
          const pending = pendingRequests.get(message.id)!;
          clearTimeout(pending.timer);
          pendingRequests.delete(message.id);
          pending.resolve(message);
        }
      };

      clientTransport.onerror = (err: unknown) => {
        logError("In-memory MCP transport error:", err);
      };

      // Perform standard initial handshake
      try {
        await new Promise<void>((resolve, reject) => {
          const id = "handshake-init";
          const timer = setTimeout(() => {
            pendingRequests.delete(id);
            reject(new Error("Handshake timeout"));
          }, 5000);

          pendingRequests.set(id, {
            resolve: () => resolve(),
            reject,
            timer,
          });

          clientTransport.send({
            jsonrpc: "2.0",
            id,
            method: "initialize",
            params: {
              protocolVersion: "2024-11-05",
              capabilities: {},
              clientInfo: { name: "navya-internal-dispatcher", version: "1.0.0" },
            },
          });
        });

        // Send notifications/initialized
        await clientTransport.send({
          jsonrpc: "2.0",
          method: "notifications/initialized",
          params: {},
        });
        logInfo("MCP in-memory dispatcher initialized successfully.");
      } catch (e) {
        logError("MCP in-memory handshake failed:", e);
      }

      clientTransportInstance = clientTransport;
      return clientTransport;
    })();
  }

  return initPromise;
}

/**
 * Handle an incoming JSON-RPC 2.0 message
 */
export async function handleJsonRpcRequest(rawMessage: any): Promise<any> {
  try {
    const client = await getClientTransport();

    // Check if message is a notification (no id)
    if (rawMessage.id === undefined || rawMessage.id === null) {
      await client.send(rawMessage);
      return null;
    }

    const id = rawMessage.id;

    return await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id);
          resolve({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32000,
              message: "Tool or method execution timed out (15s limit)",
            },
          });
        }
      }, 15000);

      pendingRequests.set(id, { resolve, reject, timer });

      client.send(rawMessage).catch((err: unknown) => {
        clearTimeout(timer);
        pendingRequests.delete(id);
        resolve({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32603,
            message: err instanceof Error ? err.message : String(err),
          },
        });
      });
    });
  } catch (err: unknown) {
    logError("handleJsonRpcRequest fatal error:", err);
    return {
      jsonrpc: "2.0",
      id: rawMessage?.id ?? null,
      error: {
        code: -32603,
        message: err instanceof Error ? err.message : String(err),
      },
    };
  }
}

/**
 * Metadata cache for OpenAPI and documentation endpoints
 */
let cachedMetadata: any = null;

export async function getMcpMetadata(): Promise<{
  tools: any[];
  resources: any[];
  prompts: any[];
}> {
  if (cachedMetadata) return cachedMetadata;

  const toolsResponse = await handleJsonRpcRequest({
    jsonrpc: "2.0",
    id: "meta-tools",
    method: "tools/list",
    params: {},
  });

  const resourcesResponse = await handleJsonRpcRequest({
    jsonrpc: "2.0",
    id: "meta-resources",
    method: "resources/list",
    params: {},
  });

  const promptsResponse = await handleJsonRpcRequest({
    jsonrpc: "2.0",
    id: "meta-prompts",
    method: "prompts/list",
    params: {},
  });

  cachedMetadata = {
    tools: toolsResponse?.result?.tools || [],
    resources: resourcesResponse?.result?.resources || [],
    prompts: promptsResponse?.result?.prompts || [],
  };

  return cachedMetadata;
}
