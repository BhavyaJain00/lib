import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logInfo } from "./logger";

export function registerPrompts(server: McpServer) {
  logInfo("Registering Navya Computech MCP prompts...");

  // 1. Course Counselor Prompt
  server.prompt(
    "admissions_counselor",
    "Expert counselor persona assisting prospective students in choosing the right computer training course.",
    {
      studentGoal: z
        .string()
        .describe("The student's career aspirations or current skill background"),
      preferredDuration: z
        .string()
        .optional()
        .describe("Time available (e.g. '1 month', '3 months', 'weekend only')"),
    },
    async ({ studentGoal, preferredDuration }) => {
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `You are the lead admissions counselor at Navya Computech, an ISO 9001:2015 certified computer training institute.
A prospective student has reached out with the following details:
- Goal / Background: "${studentGoal}"
${preferredDuration ? `- Desired Duration: "${preferredDuration}"` : ""}

Use the available MCP tools ('list_courses', 'get_course', 'get_institute_contact') to:
1. Recommend the 1 to 2 best matching courses from Navya Computech.
2. Highlight the syllabus, certification credibility (e.g. RKCL / ISO), and career prospects.
3. Invite the student to book a free 1-on-1 demo session and counseling consultation.
4. Maintain a warm, encouraging, and highly professional tone.`,
            },
          },
        ],
      };
    }
  );

  // 2. Lead Follow-up Prompt
  server.prompt(
    "lead_follow_up",
    "Draft a professional, personalized WhatsApp or email follow-up for a recent student lead.",
    {
      studentName: z.string().describe("Name of the prospective student"),
      courseName: z.string().describe("Course they showed interest in"),
      channel: z.enum(["whatsapp", "email"]).default("whatsapp").describe("Communication medium"),
    },
    async ({ studentName, courseName, channel }) => {
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Draft a friendly, polite, and persuasive ${channel.toUpperCase()} message from Navya Computech admissions to ${studentName}, who inquired about '${courseName}'.
Include:
- Friendly opening acknowledging their inquiry
- Key benefit of taking ${courseName} at Navya Computech (practical lab training, placement support)
- Offer for a free demo class this week
- Clear call to action (reply to this message or call directly)`,
            },
          },
        ],
      };
    }
  );

  // 3. Curriculum Overview Prompt
  server.prompt(
    "curriculum_overview",
    "Detailed syllabus, job roles, and comparison breakdown for a course.",
    {
      courseSlug: z.string().describe("Slug of the course (e.g. 'rscit', 'tally-gst', 'web-development')"),
    },
    async ({ courseSlug }) => {
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Please load the full course data for '${courseSlug}' using the 'get_course' tool and present a clear, structured summary including:
- Overview and target audience
- Topic-by-topic syllabus breakdown
- Certification validity and career opportunities
- Next batch availability and counseling contact`,
            },
          },
        ],
      };
    }
  );

  logInfo("Successfully registered 3 Navya Computech MCP prompts.");
}
