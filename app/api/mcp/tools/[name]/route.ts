import { NextRequest, NextResponse } from "next/server";
import { handleJsonRpcRequest } from "@/lib/mcp/rpc-handler";

export const dynamic = "force-dynamic";

/**
 * POST /api/mcp/tools/:name
 * Direct REST invocation for any MCP tool without requiring JSON-RPC encapsulation.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const rpcResponse = await handleJsonRpcRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name,
        arguments: body || {},
      },
    });

    if (rpcResponse.error) {
      return NextResponse.json(
        { error: rpcResponse.error.message },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const content = (rpcResponse.result as any)?.content?.[0]?.text;
    let parsed = content;
    try {
      parsed = JSON.parse(content);
    } catch {}

    return NextResponse.json(parsed, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
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
