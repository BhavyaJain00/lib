import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * Uploaded files are written to `public/uploads/` so Next serves them as
 * static assets — no database or storage service needed. The returned value
 * ("/uploads/<name>") is stored on the course and used directly as a URL.
 */
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const RULES = {
  image: {
    label: "Image",
    exts: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    maxMb: 4,
  },
  doc: {
    label: "Document",
    exts: [".pdf", ".doc", ".docx"],
    maxMb: 8,
  },
} as const;

/** Validates and saves an uploaded file; returns its public URL path. */
export async function saveUpload(
  file: File,
  kind: keyof typeof RULES,
): Promise<string> {
  const rule = RULES[kind];
  const ext = path.extname(file.name).toLowerCase();
  if (!(rule.exts as readonly string[]).includes(ext)) {
    throw new Error(
      `${rule.label} type not allowed — use ${rule.exts.join(", ")}.`,
    );
  }
  if (file.size > rule.maxMb * 1024 * 1024) {
    throw new Error(`${rule.label} is too large — maximum ${rule.maxMb} MB.`);
  }

  // Safe unique name: timestamp + slugified original name.
  const base =
    path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || kind;
  const name = `${Date.now()}-${base}${ext}`;

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(
    path.join(UPLOADS_DIR, name),
    Buffer.from(await file.arrayBuffer()),
  );
  return `/uploads/${name}`;
}
