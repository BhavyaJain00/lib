import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAllCourses,
  getPublicCourses,
  getPublicCourse,
  getCourseById,
  createCourse,
  updateCourse,
  setCourseField,
  deleteCourseById,
  getInquiries,
  createInquiry,
  setInquiryStatus,
  deleteInquiryById,
  getCounts,
  getActivity,
  logActivity,
  getAllPosters,
  getPublicPosters,
  createPoster,
  updatePoster,
  togglePosterActive,
  deletePosterById,
  type InquiryStatus,
} from "@/lib/db";
import { CONTACT, FAQS, STATS, WHY_US, BENEFITS } from "@/lib/data";
import { logInfo, logError } from "./logger";

function jsonResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function errorResult(message: string) {
  return {
    isError: true,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ error: message }),
      },
    ],
  };
}

export function registerTools(server: McpServer) {
  logInfo("Registering Navya Computech MCP tools...");

  /* ==========================================================================
     1. COURSE MANAGEMENT TOOLS
     ========================================================================== */

  server.tool(
    "list_courses",
    "List courses offered by Navya Computech. Supports filtering by active/live status.",
    {
      activeOnly: z
        .boolean()
        .optional()
        .default(false)
        .describe("If true, returns only live published courses visible on the website."),
    },
    async ({ activeOnly }) => {
      try {
        if (activeOnly) {
          const courses = await getPublicCourses();
          return jsonResult({ count: courses.length, courses });
        } else {
          const courses = await getAllCourses();
          return jsonResult({ count: courses.length, courses });
        }
      } catch (err: unknown) {
        logError("list_courses error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "get_course",
    "Get full details of a specific course by its unique slug or database ID.",
    {
      identifier: z
        .string()
        .min(1)
        .describe("Course URL slug (e.g. 'rscit', 'tally-gst') or Supabase course ID"),
    },
    async ({ identifier }) => {
      try {
        let course = await getPublicCourse(identifier);
        if (!course) {
          const doc = await getCourseById(identifier);
          if (doc) course = doc;
        }
        if (!course) {
          const all = await getAllCourses();
          const found = all.find((c) => c.slug === identifier || c._id === identifier);
          if (found) course = found;
        }
        if (!course) {
          return errorResult(`Course with identifier '${identifier}' was not found.`);
        }
        return jsonResult(course);
      } catch (err: unknown) {
        logError("get_course error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "create_course",
    "Create a new vocational or computer course in the Navya Computech database.",
    {
      title: z.string().min(2).describe("Name of the course (e.g. 'Advanced Python with AI')"),
      slug: z
        .string()
        .min(2)
        .regex(/^[a-z0-9-]+$/)
        .describe("Unique URL slug (e.g. 'advanced-python-ai')"),
      tagline: z.string().min(5).describe("Short catchy 1-sentence value proposition"),
      duration: z.string().describe("Duration of course (e.g. '3 Months', '45 Days')"),
      batchSize: z.string().default("Max 15 Students").describe("Batch capacity (e.g. 'Max 15 Students')"),
      level: z.string().default("Beginner").describe("Course level: Beginner, Intermediate, Advanced"),
      certification: z.string().describe("Certificate awarded (e.g. 'ISO 9001:2015 Certificate')"),
      icon: z.string().default("BookOpen").describe("Lucide icon key name (e.g. 'Award', 'Code', 'FileSpreadsheet')"),
      syllabus: z.array(z.string()).describe("List of topic modules or subjects covered"),
      careers: z.array(z.string()).describe("List of job roles students qualify for"),
      featured: z.boolean().optional().default(false).describe("Whether to showcase in top hero highlights"),
      isActive: z.boolean().optional().default(true).describe("Whether the course is immediately live on the site"),
      sortOrder: z.number().optional().default(0).describe("Display ordering number"),
    },
    async (input) => {
      try {
        const created = await createCourse({
          title: input.title,
          slug: input.slug,
          tagline: input.tagline,
          duration: input.duration,
          batchSize: input.batchSize,
          level: input.level,
          certification: input.certification,
          icon: input.icon as any,
          syllabus: input.syllabus,
          careers: input.careers,
          featured: input.featured ?? false,
          isActive: input.isActive ?? true,
          sortOrder: input.sortOrder ?? 0,
          image: null,
          document: null,
        });
        await logActivity(
          "course_create",
          `Created course '${input.title}'`,
          { detail: `Slug: ${input.slug}, Level: ${input.level}`, actor: "MCP Agent" }
        );
        return jsonResult({ success: true, course: created });
      } catch (err: unknown) {
        logError("create_course error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "update_course",
    "Update an existing course's details by its database ID.",
    {
      id: z.string().min(1).describe("The unique ID of the course to update"),
      title: z.string().optional().describe("Updated course title"),
      slug: z.string().optional().describe("Updated unique slug"),
      tagline: z.string().optional().describe("Updated tagline"),
      duration: z.string().optional().describe("Updated duration"),
      batchSize: z.string().optional().describe("Updated batch size"),
      level: z.string().optional().describe("Updated level"),
      certification: z.string().optional().describe("Updated certification"),
      icon: z.string().optional().describe("Updated icon key"),
      syllabus: z.array(z.string()).optional().describe("Updated syllabus items"),
      careers: z.array(z.string()).optional().describe("Updated career roles"),
      featured: z.boolean().optional().describe("Featured on hero"),
      isActive: z.boolean().optional().describe("Live on website"),
      sortOrder: z.number().optional().describe("Display order"),
    },
    async ({ id, ...patch }) => {
      try {
        const existing = await getCourseById(id);
        if (!existing) {
          return errorResult(`Course with ID '${id}' not found.`);
        }
        const merged = {
          title: patch.title ?? existing.title,
          slug: patch.slug ?? existing.slug,
          tagline: patch.tagline ?? existing.tagline,
          duration: patch.duration ?? existing.duration,
          batchSize: patch.batchSize ?? existing.batchSize,
          level: patch.level ?? existing.level,
          certification: patch.certification ?? existing.certification,
          icon: (patch.icon ?? existing.icon) as any,
          syllabus: patch.syllabus ?? existing.syllabus,
          careers: patch.careers ?? existing.careers,
          featured: patch.featured ?? existing.featured ?? false,
          isActive: patch.isActive ?? existing.isActive ?? true,
          sortOrder: patch.sortOrder ?? existing.sortOrder ?? 0,
          image: existing.image ?? null,
          document: existing.document ?? null,
        };
        const updated = await updateCourse(id, merged);
        await logActivity(
          "course_update",
          `Updated course '${merged.title}'`,
          { detail: `Fields changed: ${Object.keys(patch).join(", ")}`, actor: "MCP Agent" }
        );
        return jsonResult({ success: true, course: updated });
      } catch (err: unknown) {
        logError("update_course error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "delete_course",
    "Permanently remove a course from the Navya Computech catalog by its database ID.",
    {
      id: z.string().min(1).describe("The database ID of the course to remove"),
    },
    async ({ id }) => {
      try {
        const existing = await getCourseById(id);
        await deleteCourseById(id);
        await logActivity(
          "course_delete",
          `Deleted course '${existing?.title || id}'`,
          { detail: `Removed course ID: ${id}`, actor: "MCP Agent" }
        );
        return jsonResult({ success: true, message: `Course ${id} deleted successfully.` });
      } catch (err: unknown) {
        logError("delete_course error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "toggle_course_status",
    "Quickly publish or unpublish a course, or toggle its featured status.",
    {
      id: z.string().min(1).describe("The course database ID"),
      field: z.enum(["isActive", "featured"]).describe("Field to toggle: 'isActive' (live status) or 'featured' (homepage badge)"),
      value: z.boolean().describe("The new boolean state (true or false)"),
    },
    async ({ id, field, value }) => {
      try {
        await setCourseField(id, field, value);
        await logActivity(
          "course_toggle",
          `Toggled ${field} to ${value} for course ${id}`,
          { actor: "MCP Agent" }
        );
        return jsonResult({ success: true, id, field, value });
      } catch (err: unknown) {
        logError("toggle_course_status error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  /* ==========================================================================
     2. STUDENT INQUIRY (LEAD) TOOLS
     ========================================================================== */

  server.tool(
    "list_inquiries",
    "List student queries and admission leads submitted through the website.",
    {
      status: z
        .enum(["new", "contacted", "enrolled", "closed"])
        .optional()
        .describe("Filter inquiries by stage: new, contacted, enrolled, closed"),
    },
    async ({ status }) => {
      try {
        const inquiries = await getInquiries();
        const filtered = status ? inquiries.filter((inq) => inq.status === status) : inquiries;
        return jsonResult({ count: filtered.length, inquiries: filtered });
      } catch (err: unknown) {
        logError("list_inquiries error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "get_inquiry",
    "Get full details of a specific student inquiry by its unique database ID.",
    {
      id: z.string().min(1).describe("The inquiry database ID"),
    },
    async ({ id }) => {
      try {
        const inquiries = await getInquiries();
        const found = inquiries.find((i) => i._id === id);
        if (!found) return errorResult(`Inquiry with ID '${id}' not found.`);
        return jsonResult(found);
      } catch (err: unknown) {
        logError("get_inquiry error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "create_inquiry",
    "Submit a new student inquiry or admission lead into the Navya Computech system.",
    {
      fullName: z.string().min(2).describe("Student full name"),
      phone: z.string().min(10).describe("Student contact phone number"),
      email: z.string().email().optional().describe("Student email address"),
      preferredCourse: z.string().optional().describe("Name or slug of course interested in"),
      message: z.string().optional().describe("Specific questions, background or preferred timings"),
    },
    async (input) => {
      try {
        const inquiry = await createInquiry(input);
        await logActivity(
          "inquiry_create",
          `New inquiry from ${input.fullName}`,
          {
            detail: `Course: ${input.preferredCourse || "General inquiry"} | Phone: ${input.phone}`,
            actor: "Website / MCP",
          }
        );
        return jsonResult({ success: true, inquiry });
      } catch (err: unknown) {
        logError("create_inquiry error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "update_inquiry_status",
    "Update the pipeline stage of an admission lead (new -> contacted -> enrolled -> closed).",
    {
      id: z.string().min(1).describe("The inquiry database ID"),
      status: z
        .enum(["new", "contacted", "enrolled", "closed"])
        .describe("New stage: 'new' (unread), 'contacted' (counseled), 'enrolled' (joined), 'closed' (archived)"),
    },
    async ({ id, status }) => {
      try {
        await setInquiryStatus(id, status as InquiryStatus);
        await logActivity(
          "inquiry_status_change",
          `Updated inquiry ${id} status to ${status}`,
          { actor: "MCP Agent" }
        );
        return jsonResult({ success: true, id, status });
      } catch (err: unknown) {
        logError("update_inquiry_status error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "delete_inquiry",
    "Delete a student query record from the database by ID.",
    {
      id: z.string().min(1).describe("The inquiry database ID"),
    },
    async ({ id }) => {
      try {
        await deleteInquiryById(id);
        await logActivity("inquiry_delete", `Deleted inquiry ${id}`, { actor: "MCP Agent" });
        return jsonResult({ success: true, message: `Inquiry ${id} deleted successfully.` });
      } catch (err: unknown) {
        logError("delete_inquiry error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "get_inquiry_analytics",
    "Get lead funnel metrics: total inquiries, counts by stage (new, contacted, enrolled, closed), and overall conversion rate.",
    {},
    async () => {
      try {
        const inquiries = await getInquiries();
        const breakdown = {
          total: inquiries.length,
          new: inquiries.filter((i) => i.status === "new").length,
          contacted: inquiries.filter((i) => i.status === "contacted").length,
          enrolled: inquiries.filter((i) => i.status === "enrolled").length,
          closed: inquiries.filter((i) => i.status === "closed").length,
        };
        const conversionRate =
          breakdown.total > 0
            ? ((breakdown.enrolled / breakdown.total) * 100).toFixed(1) + "%"
            : "0.0%";
        return jsonResult({ breakdown, conversionRate });
      } catch (err: unknown) {
        logError("get_inquiry_analytics error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  /* ==========================================================================
     3. POSTER & BANNER MANAGEMENT TOOLS
     ========================================================================== */

  server.tool(
    "list_posters",
    "List promotional posters and announcement banners displayed on the Navya Computech website home page slider.",
    {
      activeOnly: z.boolean().optional().default(false).describe("If true, only return currently active posters"),
    },
    async ({ activeOnly }) => {
      try {
        const posters = activeOnly ? await getPublicPosters() : await getAllPosters();
        return jsonResult({ count: posters.length, posters });
      } catch (err: unknown) {
        logError("list_posters error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "create_poster",
    "Create a new promotional poster / banner announcement on the website.",
    {
      title: z.string().min(2).describe("Banner heading title (e.g. 'Admissions Open for Summer Batch!')"),
      subtitle: z.string().optional().describe("Secondary tagline or description"),
      imageUrl: z.string().describe("Image URL for the poster"),
      linkUrl: z.string().optional().describe("Optional destination link when clicked"),
      badge: z.string().optional().describe("Chip badge text (e.g. 'New Batch', 'Limited Seats')"),
      isActive: z.boolean().optional().default(true).describe("Whether banner is immediately active"),
      sortOrder: z.number().optional().default(0).describe("Order in the slider"),
    },
    async (input) => {
      try {
        const created = await createPoster({
          title: input.title,
          subtitle: input.subtitle ?? null,
          imageUrl: input.imageUrl,
          linkUrl: input.linkUrl ?? null,
          badge: input.badge ?? null,
          isActive: input.isActive ?? true,
          sortOrder: input.sortOrder ?? 0,
        });
        await logActivity("poster_create", `Created poster '${input.title}'`, { actor: "MCP Agent" });
        return jsonResult({ success: true, poster: created });
      } catch (err: unknown) {
        logError("create_poster error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "update_poster",
    "Update an existing promotional poster by ID.",
    {
      id: z.string().min(1).describe("Poster ID"),
      title: z.string().optional().describe("Updated title"),
      subtitle: z.string().optional().describe("Updated subtitle"),
      imageUrl: z.string().optional().describe("Updated image URL"),
      linkUrl: z.string().optional().describe("Updated link URL"),
      badge: z.string().optional().describe("Updated badge text"),
      isActive: z.boolean().optional().describe("Active status"),
      sortOrder: z.number().optional().describe("Sort order"),
    },
    async ({ id, ...patch }) => {
      try {
        const updated = await updatePoster(id, patch);
        await logActivity("poster_update", `Updated poster ${id}`, { actor: "MCP Agent" });
        return jsonResult({ success: true, poster: updated });
      } catch (err: unknown) {
        logError("update_poster error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "delete_poster",
    "Delete a promotional poster by ID.",
    {
      id: z.string().min(1).describe("Poster ID to delete"),
    },
    async ({ id }) => {
      try {
        await deletePosterById(id);
        await logActivity("poster_delete", `Deleted poster ${id}`, { actor: "MCP Agent" });
        return jsonResult({ success: true, message: `Poster ${id} deleted successfully.` });
      } catch (err: unknown) {
        logError("delete_poster error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  /* ==========================================================================
     4. ANALYTICS & AUDIT LOG TOOLS
     ========================================================================== */

  server.tool(
    "get_dashboard_analytics",
    "Retrieve high-level institute statistics: course counts, live courses, total inquiries, new inquiries, and active posters.",
    {},
    async () => {
      try {
        const counts = await getCounts();
        return jsonResult({
          timestamp: new Date().toISOString(),
          metrics: counts,
        });
      } catch (err: unknown) {
        logError("get_dashboard_analytics error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "get_activity_log",
    "Retrieve chronological audit log entries showing recent admin changes and system events.",
    {
      limit: z.number().optional().default(50).describe("Max entries to return (default: 50)"),
    },
    async ({ limit }) => {
      try {
        const log = await getActivity(limit);
        return jsonResult({ count: log.length, activities: log });
      } catch (err: unknown) {
        logError("get_activity_log error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  server.tool(
    "log_site_activity",
    "Record a custom audit entry in the activity log.",
    {
      type: z.string().min(2).describe("Activity category (e.g. 'mcp_action', 'lead_followup')"),
      summary: z.string().min(3).describe("Short 1-sentence action summary"),
      detail: z.string().optional().describe("Optional JSON or markdown details"),
      actor: z.string().optional().default("MCP Assistant").describe("Actor name"),
    },
    async ({ type, summary, detail, actor }) => {
      try {
        await logActivity(type, summary, { detail: detail ?? undefined, actor });
        return jsonResult({ success: true, message: "Activity logged successfully." });
      } catch (err: unknown) {
        logError("log_site_activity error:", err);
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    }
  );

  /* ==========================================================================
     5. INSTITUTE DETAILS & CONTENT TOOLS
     ========================================================================== */

  server.tool(
    "get_institute_contact",
    "Get official Navya Computech contact details: direct phone, WhatsApp URL, email, and physical campus address.",
    {},
    async () => {
      return jsonResult({
        name: "Navya Computech",
        contact: CONTACT,
      });
    }
  );

  server.tool(
    "search_faqs",
    "Search Navya Computech frequently asked questions regarding admission eligibility, fees, certificates, batches, and demo classes.",
    {
      query: z.string().optional().describe("Search keyword (e.g. 'fees', 'certificate', 'timings', 'demo')"),
    },
    async ({ query }) => {
      if (!query || query.trim() === "") {
        return jsonResult({ count: FAQS.length, faqs: FAQS });
      }
      const qLower = query.toLowerCase();
      const matched = FAQS.filter(
        (item) => item.q.toLowerCase().includes(qLower) || item.a.toLowerCase().includes(qLower)
      );
      return jsonResult({ count: matched.length, query, faqs: matched });
    }
  );

  server.tool(
    "get_institute_highlights",
    "Get Navya Computech's core value propositions, why-us points, student benefits, and social proof stats.",
    {},
    async () => {
      return jsonResult({
        stats: STATS,
        whyChooseUs: WHY_US,
        studentBenefits: BENEFITS,
      });
    }
  );

  logInfo("Successfully registered 22 Navya Computech MCP tools.");
}
