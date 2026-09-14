import { NextRequest, NextResponse } from "next/server";
import { getMcpMetadata } from "@/lib/mcp/rpc-handler";

export const dynamic = "force-dynamic";

/**
 * GET /api/mcp/openapi
 * Dynamic OpenAPI 3.0.0 specification for all tools.
 * Used by Google AI Studio Extensions, Vertex AI, Custom GPTs, and web agents.
 */
export async function GET(req: NextRequest) {
  const metadata = await getMcpMetadata();
  const origin =
    req.nextUrl.origin ||
    `http://${req.headers.get("host") || "localhost:3000"}`;

  const paths: Record<string, any> = {};

  for (const tool of metadata.tools) {
    paths[`/api/mcp/tools/${tool.name}`] = {
      post: {
        operationId: tool.name,
        summary: tool.description,
        description: tool.description,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: tool.inputSchema || { type: "object", properties: {} },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful tool execution",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
        },
      },
    };
  }

  const openApiSpec = {
    openapi: "3.0.0",
    info: {
      title: "Navya Computech MCP Connector API",
      version: "1.0.0",
      description:
        "OpenAPI Specification and Remote Connector for Navya Computech tools and institute data. Compatible with Gemini Extensions, Claude Connectors, and MCP clients.",
    },
    servers: [
      {
        url: origin,
        description: "Current environment (Localhost or Production)",
      },
    ],
    paths,
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
