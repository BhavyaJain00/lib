import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { COURSES, type Course } from "@/lib/data";
import type { IconKey } from "@/lib/icons";

/* --------------------------------- Types ---------------------------------- */

export type CourseDoc = Course & {
  _id: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type InquiryStatus = "new" | "contacted" | "enrolled" | "closed";

export type InquiryDoc = {
  _id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  preferredCourse?: string | null;
  message?: string | null;
  status: InquiryStatus;
  createdAt: string;
};

export type ActivityDoc = {
  _id: string;
  type: string;
  summary: string;
  detail?: string | null;
  actor: string;
  createdAt: string;
};

/* --------------------------------- Storage --------------------------------- */

/**
 * All data lives in plain JSON files inside the project's `data/` folder — no
 * database needed. The files are created automatically on first use, and the
 * course catalogue is seeded from the samples in lib/data.ts, so the admin
 * panel works out of the box. Open the files in any editor to inspect data.
 *
 * On serverless hosts (e.g. Vercel) the filesystem is read-only, so the first
 * failed write flips storage over to an in-memory copy kept on globalThis.
 * The bundled data/courses.json still serves the real catalogue; queries and
 * edits made on the live site last only as long as the server instance.
 */
const DATA_DIR = path.join(process.cwd(), "data");

const FILES = {
  courses: path.join(DATA_DIR, "courses.json"),
  inquiries: path.join(DATA_DIR, "inquiries.json"),
  activity: path.join(DATA_DIR, "activity.json"),
} as const;

/** Newest activity entries kept on disk — stops the log growing forever. */
const ACTIVITY_CAP = 500;

// All writes are funnelled through one promise chain (cached on globalThis so
// dev hot reloads reuse it) — two server actions can never interleave a
// read-modify-write on the same file.
const globalForStore = globalThis as unknown as {
  _jsonStoreLock?: Promise<unknown>;
  _memStore?: Map<string, unknown[]>;
  _fsReadOnly?: boolean;
};

/** In-memory lists (keyed by file path) used once the disk turns out to be read-only. */
function memStore(): Map<string, unknown[]> {
  if (!globalForStore._memStore) globalForStore._memStore = new Map();
  return globalForStore._memStore;
}

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = (globalForStore._jsonStoreLock ?? Promise.resolve()).then(fn, fn);
  globalForStore._jsonStoreLock = run.catch(() => undefined);
  return run;
}

/** Parsed list from memory or a JSON file, or null when missing/unreadable. */
async function readList<T>(file: string): Promise<T[] | null> {
  const mem = memStore().get(file);
  if (mem) return mem as T[];
  try {
    const parsed = JSON.parse(await fs.readFile(file, "utf8"));
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

// Write to a temp file then rename over the target — a crash mid-write can't
// leave a half-written (corrupt) JSON file behind. If the disk can't be
// written at all (read-only serverless host), keep the list in memory instead.
async function writeList(file: string, list: unknown[]): Promise<void> {
  if (!globalForStore._fsReadOnly) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const tmp = `${file}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
      await fs.rename(tmp, file);
      return;
    } catch {
      globalForStore._fsReadOnly = true;
    }
  }
  memStore().set(file, list);
}

function seedCourses(): CourseDoc[] {
  const now = new Date().toISOString();
  return COURSES.map((c, i) => ({
    ...c,
    _id: randomUUID(),
    featured: c.featured ?? false,
    isActive: true,
    sortOrder: i,
    createdAt: now,
    updatedAt: now,
  }));
}

/** The course list, seeding the starter catalogue on very first run. */
async function loadCourses(): Promise<CourseDoc[]> {
  const list = await readList<CourseDoc>(FILES.courses);
  if (list) return list;
  return withLock(async () => {
    // Re-check inside the lock — another request may have seeded meanwhile.
    const again = await readList<CourseDoc>(FILES.courses);
    if (again) return again;
    const seeded = seedCourses();
    await writeList(FILES.courses, seeded);
    return seeded;
  });
}

/**
 * Read-modify-write on one file under the lock. `fallback` supplies the list
 * when the file doesn't exist yet. If `fn` throws, nothing is written.
 */
async function mutate<T, R>(
  file: string,
  fallback: () => T[],
  fn: (list: T[]) => R,
): Promise<R> {
  return withLock(async () => {
    const list = (await readList<T>(file)) ?? fallback();
    const result = fn(list);
    await writeList(file, list);
    return result;
  });
}

const empty = () => [];

/* --------------------------------- Courses -------------------------------- */

function courseSort(a: CourseDoc, b: CourseDoc): number {
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title);
}

/** Courses shown on the public site (active only). */
export async function getPublicCourses(): Promise<Course[]> {
  const list = await loadCourses();
  return list.filter((c) => c.isActive !== false).sort(courseSort);
}

export async function getPublicCourse(slug: string): Promise<Course | undefined> {
  const list = await loadCourses();
  return list.find((c) => c.slug === slug && c.isActive !== false);
}

/** Every course including hidden ones — admin only. */
export async function getAllCourses(): Promise<CourseDoc[]> {
  const list = await loadCourses();
  return [...list].sort(courseSort);
}

export async function getCourseById(id: string): Promise<CourseDoc | null> {
  const list = await loadCourses();
  return list.find((c) => c._id === id) ?? null;
}

export type CourseInput = {
  slug: string;
  title: string;
  icon: IconKey;
  tagline: string;
  duration: string;
  batchSize: string;
  level: string;
  certification: string;
  syllabus: string[];
  careers: string[];
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
  image: string | null;
  document: string | null;
};

export async function createCourse(input: CourseInput) {
  await mutate(FILES.courses, seedCourses, (list) => {
    if (list.some((c) => c.slug === input.slug)) {
      throw new Error(`A course with slug "${input.slug}" already exists.`);
    }
    const now = new Date().toISOString();
    list.push({ ...input, _id: randomUUID(), createdAt: now, updatedAt: now });
  });
}

export async function updateCourse(id: string, input: CourseInput) {
  await mutate(FILES.courses, seedCourses, (list) => {
    if (list.some((c) => c.slug === input.slug && c._id !== id)) {
      throw new Error(`Another course already uses slug "${input.slug}".`);
    }
    const idx = list.findIndex((c) => c._id === id);
    if (idx === -1) throw new Error("Course not found.");
    list[idx] = { ...list[idx], ...input, updatedAt: new Date().toISOString() };
  });
}

export async function setCourseField(
  id: string,
  field: "isActive" | "featured",
  value: boolean,
) {
  await mutate(FILES.courses, seedCourses, (list) => {
    const course = list.find((c) => c._id === id);
    if (!course) throw new Error("Course not found.");
    course[field] = value;
    course.updatedAt = new Date().toISOString();
  });
}

export async function deleteCourseById(id: string) {
  await mutate(FILES.courses, seedCourses, (list) => {
    const idx = list.findIndex((c) => c._id === id);
    if (idx !== -1) list.splice(idx, 1);
  });
}

/* -------------------------------- Inquiries ------------------------------- */

export async function createInquiry(input: {
  fullName: string;
  phone: string;
  email?: string | null;
  preferredCourse?: string | null;
  message?: string | null;
}) {
  await mutate<InquiryDoc, void>(FILES.inquiries, empty, (list) => {
    list.unshift({
      ...input,
      _id: randomUUID(),
      email: input.email ?? null,
      preferredCourse: input.preferredCourse ?? null,
      message: input.message ?? null,
      status: "new",
      createdAt: new Date().toISOString(),
    });
  });
}

export async function getInquiries(): Promise<InquiryDoc[]> {
  const list = (await readList<InquiryDoc>(FILES.inquiries)) ?? [];
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  await mutate<InquiryDoc, void>(FILES.inquiries, empty, (list) => {
    const inquiry = list.find((q) => q._id === id);
    if (!inquiry) throw new Error("Query not found.");
    inquiry.status = status;
  });
}

export async function deleteInquiryById(id: string) {
  await mutate<InquiryDoc, void>(FILES.inquiries, empty, (list) => {
    const idx = list.findIndex((q) => q._id === id);
    if (idx !== -1) list.splice(idx, 1);
  });
}

/* -------------------------------- Activity -------------------------------- */

/**
 * Records a site/admin event. Never throws — logging must not break the action
 * that triggered it.
 */
export async function logActivity(
  type: string,
  summary: string,
  opts: { detail?: string; actor?: string } = {},
) {
  try {
    await mutate<ActivityDoc, void>(FILES.activity, empty, (list) => {
      list.unshift({
        _id: randomUUID(),
        type,
        summary,
        detail: opts.detail ?? null,
        actor: opts.actor ?? "visitor",
        createdAt: new Date().toISOString(),
      });
      if (list.length > ACTIVITY_CAP) list.length = ACTIVITY_CAP;
    });
  } catch {
    // ignore — activity logging is best-effort
  }
}

export async function getActivity(limit = 200): Promise<ActivityDoc[]> {
  const list = (await readList<ActivityDoc>(FILES.activity)) ?? [];
  return [...list]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/* --------------------------------- Counts --------------------------------- */

export async function getCounts() {
  const [courses, inquiries, activity] = await Promise.all([
    loadCourses(),
    getInquiries(),
    getActivity(ACTIVITY_CAP),
  ]);
  return {
    inquiries: inquiries.length,
    newInquiries: inquiries.filter((q) => q.status === "new").length,
    courses: courses.filter((c) => c.isActive !== false).length,
    activity: activity.length,
  };
}
