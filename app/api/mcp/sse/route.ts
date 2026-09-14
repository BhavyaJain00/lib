import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { registerSession, unregisterSession } from "@/lib/mcp/sse-sessions";

export const dynamic = "force-dynamic";

/**
 * GET /api/mcp/sse
 * Server-Sent Events (SSE) streaming transport for MCP clients (Claude Desktop, mcp-remote, etc.)
 */
export async function GET(req: NextRequest) {
  const sessionId = randomUUID();
  const origin =
    req.nextUrl.origin ||
    `http://${req.headers.get("host") || "localhost:3000"}`;

  const encoder = new TextEncoder();
  let keepAliveInterval: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        try {
          controller.enqueue(encoder.encode(data));
        } catch {
          // Stream closed
        }
      };

      const close = () => {
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        try {
          controller.close();
        } catch {}
      };

      registerSession({ sessionId, send, close });

      // Send initial endpoint event as mandated by Model Context Protocol (MCP) SSE specification
      const endpointUrl = `${origin}/api/mcp/message?sessionId=${sessionId}`;
      const initialPayload = `event: endpoint\ndata: ${endpointUrl}\n\n`;
      controller.enqueue(encoder.encode(initialPayload));

      // Periodic comment keepalive every 15s to keep proxy connections alive
      keepAliveInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          if (keepAliveInterval) clearInterval(keepAliveInterval);
        }
      }, 15000);
    },
    cancel() {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      unregisterSession(sessionId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
