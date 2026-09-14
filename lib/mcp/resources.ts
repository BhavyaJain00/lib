import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getPublicCourses, getCounts } from "@/lib/db";
import { CONTACT, FAQS, STATS } from "@/lib/data";
import { logInfo, logError } from "./logger";

export function registerResources(server: McpServer) {
  logInfo("Registering Navya Computech MCP resources...");

  // 1. Course Catalog Resource
  server.resource(
    "courses-catalog",
    "navya://courses/catalog",
    {
      description: "Live snapshot of all published computer courses with syllabi and durations.",
      mimeType: "application/json",
    },
    async (uri) => {
      try {
        const courses = await getPublicCourses();
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(courses, null, 2),
            },
          ],
        };
      } catch (err: unknown) {
        logError("courses-catalog resource error:", err);
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
            },
          ],
        };
      }
    }
  );

  // 2. Institute Contact Details Resource
  server.resource(
    "institute-contact",
    "navya://institute/contact",
    {
      description: "Official Navya Computech contact coordinates, phone, WhatsApp, and campus address.",
      mimeType: "application/json",
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ name: "Navya Computech", contact: CONTACT }, null, 2),
          },
        ],
      };
    }
  );

  // 3. FAQs Knowledge Base Resource
  server.resource(
    "institute-faqs",
    "navya://institute/faqs",
    {
      description: "Frequently asked questions covering admissions, fees, demo classes, and certificates.",
      mimeType: "application/json",
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(FAQS, null, 2),
          },
        ],
      };
    }
  );

  // 4. Institute Statistics & Funnel Metrics Resource
  server.resource(
    "institute-stats",
    "navya://institute/stats",
    {
      description: "Aggregate institute metrics: total courses, students trained, placement rate.",
      mimeType: "application/json",
    },
    async (uri) => {
      try {
        const counts = await getCounts();
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(
                {
                  highlights: STATS,
                  databaseCounts: counts,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (err: unknown) {
        logError("institute-stats resource error:", err);
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify({ highlights: STATS }),
            },
          ],
        };
      }
    }
  );

  logInfo("Successfully registered 4 Navya Computech MCP resources.");
}
