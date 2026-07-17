import { requireAdmin } from "@/lib/auth";
import { isDbConfigured } from "@/lib/mongodb";
import { getInquiries } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Escapes a value for CSV — wraps in quotes and doubles inner quotes. */
function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!isDbConfigured) {
    return new Response(
      "Database not connected. Add MONGODB_URI to .env to export data.",
      { status: 503 },
    );
  }

  const inquiries = await getInquiries();

  const header = ["Name", "Phone", "Email", "Course", "Message", "Status", "Date"];
  const rows = inquiries.map((q) =>
    [
      q.fullName,
      q.phone,
      q.email,
      q.preferredCourse,
      q.message,
      q.status,
      new Date(q.createdAt).toLocaleString("en-IN"),
    ]
      .map(csvCell)
      .join(","),
  );

  // Prepend a UTF-8 BOM so Excel opens the file with correct encoding.
  const bom = String.fromCharCode(0xfeff);
  const csv = bom + [header.map(csvCell).join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="queries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
