import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/mcp/sse-sessions";
import { handleJsonRpcRequest } from "@/lib/mcp/rpc-handler";
import { logError, logInfo } from "@/lib/mcp/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/mcp/message?sessionId=...
 * Receives JSON-RPC messages from active MCP SSE clients and sends results via the SSE stream.
 */
export async function POST(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    const body = await req.json();

    logInfo(
      `Received SSE message for session [${sessionId || "none"}]: ${body?.method || "unknown"}`
    );

    const rpcResponse = await handleJsonRpcRequest(body);

    if (sessionId) {
      const session = getSession(sessionId);
      if (session) {
        if (rpcResponse) {
          session.send(`event: message\ndata: ${JSON.stringify(rpcResponse)}\n\n`);
        }
        return new NextResponse(null, {
          status: 202,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      } else {
        logInfo(`Session ${sessionId} not found in memory (possibly expired). Returning direct response.`);
      }
    }

    if (!rpcResponse) {
      return new NextResponse(null, {
        status: 204,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    return NextResponse.json(rpcResponse, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logError("Error in /api/mcp/message:", message);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: `Internal server error: ${message}` },
      },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
