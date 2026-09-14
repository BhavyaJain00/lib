import { NextRequest, NextResponse } from "next/server";
import { handleJsonRpcRequest, getMcpMetadata } from "@/lib/mcp/rpc-handler";

export const dynamic = "force-dynamic";

/**
 * GET /api/mcp
 * Self-documenting endpoint returning server metadata, health, capabilities, and tool schemas.
 */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin || `http://${req.headers.get("host") || "localhost:3000"}`;
  const metadata = await getMcpMetadata();

  return NextResponse.json(
    {
      name: "navya-computech",
      version: "1.0.0",
      status: "online",
      protocolVersion: "2024-11-05",
      description:
        "Navya Computech native Model Context Protocol (MCP) Server and Remote Tool Connector.",
      endpoints: {
        httpJsonRpc: `${origin}/api/mcp`,
        sseStream: `${origin}/api/mcp/sse`,
        openApiSpec: `${origin}/api/mcp/openapi`,
        restToolsBase: `${origin}/api/mcp/tools/:name`,
      },
      capabilities: {
        tools: { listChanged: true },
        resources: { listChanged: true },
        prompts: { listChanged: true },
      },
      counts: {
        tools: metadata.tools.length,
        resources: metadata.resources.length,
        prompts: metadata.prompts.length,
      },
      tools: metadata.tools,
      resources: metadata.resources,
      prompts: metadata.prompts,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

/**
 * POST /api/mcp
 * Standard MCP JSON-RPC 2.0 request handler over HTTP.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle batch JSON-RPC requests
    if (Array.isArray(body)) {
      const responses = await Promise.all(
        body.map((singleReq) => handleJsonRpcRequest(singleReq))
      );
      return NextResponse.json(responses.filter(Boolean), {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const response = await handleJsonRpcRequest(body);

    if (!response) {
      // Notification handled without response
      return new NextResponse(null, {
        status: 204,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    return NextResponse.json(response, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: `Parse error: ${message}` },
      },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-session-id",
    },
  });
}
