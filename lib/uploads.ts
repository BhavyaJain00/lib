import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";

/**
 * When Supabase is configured, uploads go to its public "uploads" Storage
 * bucket (created by supabase/schema.sql) and the stored value is the file's
 * permanent https URL — this is what the deployed site needs, since serverless
 * filesystems are read-only.
 *
 * Without Supabase, files are written to `public/uploads/` so Next serves
 * them as static assets ("/uploads/<name>"). On read-only hosts that write
 * falls back to an in-memory map served by app/uploads/[name]/route.ts, and
 * such files last only as long as the server instance.
 */
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const STORAGE_BUCKET = "uploads";

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

/** Content types for every extension RULES allows. */
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export type StoredUpload = { contentType: string; data: Buffer };

const globalForUploads = globalThis as unknown as {
  _memUploads?: Map<string, StoredUpload>;
  _uploadsFsReadOnly?: boolean;
};

function memUploads(): Map<string, StoredUpload> {
  if (!globalForUploads._memUploads) globalForUploads._memUploads = new Map();
  return globalForUploads._memUploads;
}

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
  const data = Buffer.from(await file.arrayBuffer());
  const contentType = MIME[ext] ?? "application/octet-stream";

  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.storage
      .from(STORAGE_BUCKET)
      .upload(name, data, { contentType, upsert: false });
    if (error) {
      throw new Error(
        `${rule.label} upload failed: ${error.message}. ` +
          `Check that the public "${STORAGE_BUCKET}" bucket exists in Supabase (run supabase/schema.sql).`,
      );
    }
    return sb.storage.from(STORAGE_BUCKET).getPublicUrl(name).data.publicUrl;
  }

  if (!globalForUploads._uploadsFsReadOnly) {
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      await fs.writeFile(path.join(UPLOADS_DIR, name), data);
      return `/uploads/${name}`;
    } catch {
      globalForUploads._uploadsFsReadOnly = true;
    }
  }

  memUploads().set(name, { contentType, data });
  return `/uploads/${name}`;
}

/** A stored upload for app/uploads/[name]/route.ts, or null when unknown. */
export async function getUpload(name: string): Promise<StoredUpload | null> {
  // The name comes from the URL — never let it escape the uploads folder.
  if (path.basename(name) !== name) return null;

  const mem = memUploads().get(name);
  if (mem) return mem;

  // Files on disk are normally served straight from public/, but cover the
  // case where the request reaches this route anyway.
  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, name));
    return {
      contentType: MIME[path.extname(name).toLowerCase()] ?? "application/octet-stream",
      data,
    };
  } catch {
    return null;
  }
}
