import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { COURSES, type Course } from "@/lib/data";
import type { IconKey } from "@/lib/icons";
import { getSupabase } from "@/lib/supabase";

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

export type ChatTalkDoc = {
  _id: string;
  userQuestion: string;
  botReply: string;
  score?: 1 | -1 | null;
  courseSlug?: string | null;
  isAi?: boolean;
  createdAt: string;
};

/* -------------------------------- Supabase --------------------------------- */


/**
 * When the Supabase env vars are set (see SUPABASE.md), all data lives in
 * hosted Postgres — this is REQUIRED for the deployed site, because serverless
 * filesystems are read-only and the JSON-file fallback below can't persist
 * admin edits there. Without the env vars the site runs in demo mode on the
 * local JSON files, so `npm run dev` works out of the box.
 *
 * Postgres columns are snake_case; these helpers map rows to the camelCase
 * shapes the app uses. Tables are created by supabase/schema.sql.
 */

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  icon: string;
  tagline: string;
  duration: string;
  batch_size: string;
  level: string;
  certification: string;
  syllabus: string[] | null;
  careers: string[] | null;
  featured: boolean;
  is_active: boolean;
  sort_order: number;
  image: string | null;
  document: string | null;
  created_at: string;
  updated_at: string;
};

function rowToCourse(row: CourseRow): CourseDoc {
  return {
    _id: row.id,
    slug: row.slug,
    title: row.title,
    icon: row.icon as IconKey,
    tagline: row.tagline,
    duration: row.duration,
    batchSize: row.batch_size,
    level: row.level,
    certification: row.certification,
    syllabus: row.syllabus ?? [],
    careers: row.careers ?? [],
    featured: row.featured,
    image: row.image,
    document: row.document,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function courseToRow(input: CourseInput) {
  return {
    slug: input.slug,
    title: input.title,
    icon: input.icon,
    tagline: input.tagline,
    duration: input.duration,
    batch_size: input.batchSize,
    level: input.level,
    certification: input.certification,
    syllabus: input.syllabus,
    careers: input.careers,
    featured: input.featured,
    is_active: input.isActive,
    sort_order: input.sortOrder,
    image: input.image,
    document: input.document,
  };
}

type SbError = { code?: string; message: string } | null;

/** Postgres error codes worth translating for the admin UI. */
const PG_UNIQUE_VIOLATION = "23505";
const PG_INVALID_UUID = "22P02";

/** Throws a friendly error for a Supabase failure (never returns). */
function fail(error: NonNullable<SbError>, context: string): never {
  if (error.code === PG_UNIQUE_VIOLATION) {
    throw new Error("A course with that slug already exists.");
  }
  throw new Error(`${context}: ${error.message}`);
}

/* --------------------------------- Storage --------------------------------- */

/**
 * DEMO-MODE FALLBACK — used only when Supabase isn't configured. Data lives in
 * plain JSON files inside the project's `data/` folder. The files are created
 * automatically on first use, and the course catalogue is seeded from the
 * samples in lib/data.ts, so the admin panel works out of the box locally.
 *
 * On serverless hosts (e.g. Vercel) the filesystem is read-only, so the first
 * failed write flips storage over to an in-memory copy kept on globalThis —
 * edits made on the live site LAST ONLY MINUTES and silently revert. Connect
 * Supabase (see SUPABASE.md) before deploying.
 */
const DATA_DIR = path.join(process.cwd(), "data");

const FILES = {
  courses: path.join(DATA_DIR, "courses.json"),
  inquiries: path.join(DATA_DIR, "inquiries.json"),
  activity: path.join(DATA_DIR, "activity.json"),
  chats: path.join(DATA_DIR, "chats.json"),
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
  memStore().set(file, list);
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
}

const SEED_COURSE_IDS: Record<string, string> = {
  rscit: "f927265c-eec6-44ae-a383-afb258fe32eb",
  "basic-computer": "570dfc9a-a994-4fa7-b0ba-927cca503ed2",
  "advance-computer": "89d39f1d-4e94-4ac5-a0e0-26659cab5178",
  "tally-gst": "a1b2c3d4-e5f6-47a8-b9c0-112233445566",
  "web-designing": "b2c3d4e5-f6a7-48b9-c0d1-223344556677",
  "python-programming": "c3d4e5f6-a7b8-49c0-d1e2-334455667788",
  "cpp-programming": "d4e5f6a7-b8c9-40d1-e2f3-445566778899",
  "dca-pgdca": "e5f6a7b8-c9d0-41e2-f3a4-556677889900",
};

function seedCourses(): CourseDoc[] {
  const now = new Date().toISOString();
  return COURSES.map((c, i) => ({
    ...c,
    _id: SEED_COURSE_IDS[c.slug] || randomUUID(),
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
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });
    if (error) fail(error, "Could not load courses");
    return (data as CourseRow[]).map(rowToCourse);
  }

  const list = await loadCourses();
  return list.filter((c) => c.isActive !== false).sort(courseSort);
}

export async function getPublicCourse(slug: string): Promise<Course | undefined> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) fail(error, "Could not load the course");
    return data ? rowToCourse(data as CourseRow) : undefined;
  }

  const list = await loadCourses();
  return list.find((c) => c.slug === slug && c.isActive !== false);
}

/** Every course including hidden ones — admin only. */
export async function getAllCourses(): Promise<CourseDoc[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });
    if (error) fail(error, "Could not load courses");
    return (data as CourseRow[]).map(rowToCourse);
  }

  const list = await loadCourses();
  return [...list].sort(courseSort);
}

export async function getCourseById(id: string): Promise<CourseDoc | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("courses")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    // A malformed id (e.g. one left over from the file store) is "not found",
    // not a crash — Postgres rejects non-UUID strings outright.
    if (error && error.code === PG_INVALID_UUID) return null;
    if (error) fail(error, "Could not load the course");
    return data ? rowToCourse(data as CourseRow) : null;
  }

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
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("courses").insert(courseToRow(input));
    if (error) fail(error, "Could not create the course");
    return;
  }

  await mutate(FILES.courses, seedCourses, (list) => {
    if (list.some((c) => c.slug === input.slug)) {
      throw new Error(`A course with slug "${input.slug}" already exists.`);
    }
    const now = new Date().toISOString();
    list.push({ ...input, _id: randomUUID(), createdAt: now, updatedAt: now });
  });
}

export async function updateCourse(id: string, input: CourseInput) {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("courses")
      .update({ ...courseToRow(input), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id");
    if (error && error.code === PG_INVALID_UUID)
      throw new Error("Course not found.");
    if (error) fail(error, "Could not save the course");
    if (!data || data.length === 0) throw new Error("Course not found.");
    return;
  }

  await mutate(FILES.courses, seedCourses, (list) => {
    if (list.some((c) => c.slug === input.slug && c._id !== id && c.slug !== id)) {
      throw new Error(`Another course already uses slug "${input.slug}".`);
    }
    const idx = list.findIndex((c) => c._id === id || c.slug === id);
    if (idx === -1) throw new Error("Course not found.");
    list[idx] = { ...list[idx], ...input, updatedAt: new Date().toISOString() };
  });
}

export async function setCourseField(
  id: string,
  field: "isActive" | "featured",
  value: boolean,
) {
  const sb = getSupabase();
  if (sb) {
    const column = field === "isActive" ? "is_active" : "featured";
    const { data, error } = await sb
      .from("courses")
      .update({ [column]: value, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id");
    if (error && error.code === PG_INVALID_UUID)
      throw new Error("Course not found.");
    if (error) fail(error, "Could not update the course");
    if (!data || data.length === 0) throw new Error("Course not found.");
    return;
  }

  await mutate(FILES.courses, seedCourses, (list) => {
    const course = list.find((c) => c._id === id || c.slug === id);
    if (!course) throw new Error("Course not found.");
    course[field] = value;
    course.updatedAt = new Date().toISOString();
  });
}

export async function deleteCourseById(id: string) {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("courses").delete().eq("id", id);
    if (error && error.code === PG_INVALID_UUID) return;
    if (error) fail(error, "Could not delete the course");
    return;
  }

  await mutate(FILES.courses, seedCourses, (list) => {
    const idx = list.findIndex((c) => c._id === id || c.slug === id);
    if (idx === -1) throw new Error("Course not found.");
    list.splice(idx, 1);
  });
}

/* -------------------------------- Inquiries ------------------------------- */

type InquiryRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  preferred_course: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
};

function rowToInquiry(row: InquiryRow): InquiryDoc {
  return {
    _id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    preferredCourse: row.preferred_course,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function createInquiry(input: {
  fullName: string;
  phone: string;
  email?: string | null;
  preferredCourse?: string | null;
  message?: string | null;
}) {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("inquiries").insert({
      full_name: input.fullName,
      phone: input.phone,
      email: input.email ?? null,
      preferred_course: input.preferredCourse ?? null,
      message: input.message ?? null,
      status: "new",
    });
    if (error) fail(error, "Could not save your query");
    return;
  }

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
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) fail(error, "Could not load queries");
    return (data as InquiryRow[]).map(rowToInquiry);
  }

  const list = (await readList<InquiryDoc>(FILES.inquiries)) ?? [];
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("inquiries")
      .update({ status })
      .eq("id", id)
      .select("id");
    if (error && error.code === PG_INVALID_UUID)
      throw new Error("Query not found.");
    if (error) fail(error, "Could not update the query");
    if (!data || data.length === 0) throw new Error("Query not found.");
    return;
  }

  await mutate<InquiryDoc, void>(FILES.inquiries, empty, (list) => {
    const inquiry = list.find((q) => q._id === id);
    if (!inquiry) throw new Error("Query not found.");
    inquiry.status = status;
  });
}

export async function deleteInquiryById(id: string) {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("inquiries").delete().eq("id", id);
    if (error && error.code === PG_INVALID_UUID) return;
    if (error) fail(error, "Could not delete the query");
    return;
  }

  await mutate<InquiryDoc, void>(FILES.inquiries, empty, (list) => {
    const idx = list.findIndex((q) => q._id === id);
    if (idx !== -1) list.splice(idx, 1);
  });
}

/* -------------------------------- Activity -------------------------------- */

type ActivityRow = {
  id: string;
  type: string;
  summary: string;
  detail: string | null;
  actor: string;
  created_at: string;
};

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
    const sb = getSupabase();
    if (sb) {
      await sb.from("activity").insert({
        type,
        summary,
        detail: opts.detail ?? null,
        actor: opts.actor ?? "visitor",
      });
      return;
    }

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
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("activity")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) fail(error, "Could not load activity");
    return (data as ActivityRow[]).map((row) => ({
      _id: row.id,
      type: row.type,
      summary: row.summary,
      detail: row.detail,
      actor: row.actor,
      createdAt: row.created_at,
    }));
  }

  const list = (await readList<ActivityDoc>(FILES.activity)) ?? [];
  return [...list]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/* --------------------------------- Counts --------------------------------- */

export async function getCounts() {
  const sb = getSupabase();
  if (sb) {
    const [inquiries, newInquiries, courses, activity, chats] = await Promise.all([
      sb.from("inquiries").select("*", { count: "exact", head: true }),
      sb
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "new"),
      sb
        .from("courses")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      sb.from("activity").select("*", { count: "exact", head: true }),
      sb.from("chat_talks").select("*", { count: "exact", head: true }),
    ]);
    const firstError =
      inquiries.error ?? newInquiries.error ?? courses.error ?? activity.error ?? chats.error;
    if (firstError) fail(firstError, "Could not load the dashboard counts");

    const libraryCountRes = await sb
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .or("preferred_course.ilike.%library%,preferred_course.ilike.%seat%,message.ilike.%shift%");

    return {
      inquiries: inquiries.count ?? 0,
      newInquiries: newInquiries.count ?? 0,
      courses: courses.count ?? 0,
      activity: activity.count ?? 0,
      chats: chats.count ?? 0,
      libraryInquiries: libraryCountRes.count ?? 0,
    };
  }

  const [courses, inquiries, activity, chats] = await Promise.all([
    loadCourses(),
    getInquiries(),
    getActivity(ACTIVITY_CAP),
    getChatTalks(),
  ]);
  const libraryInquiries = inquiries.filter(
    (q) =>
      q.preferredCourse?.toLowerCase().includes("library") ||
      q.preferredCourse?.toLowerCase().includes("seat") ||
      q.preferredCourse?.toLowerCase().includes("reading") ||
      q.message?.toLowerCase().includes("shift") ||
      q.message?.toLowerCase().includes("library")
  );
  return {
    inquiries: inquiries.length,
    newInquiries: inquiries.filter((q) => q.status === "new").length,
    courses: courses.filter((c) => c.isActive !== false).length,
    activity: activity.length,
    chats: chats.length,
    libraryInquiries: libraryInquiries.length,
  };
}

/* ------------------------------- Chat Talks -------------------------------- */

export async function getChatTalks(): Promise<ChatTalkDoc[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("chat_talks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) fail(error, "Could not load chat talks");
    return (data ?? []).map((row: any) => ({
      _id: row.id,
      userQuestion: row.user_question,
      botReply: row.bot_reply,
      score: row.score,
      courseSlug: row.course_slug,
      isAi: row.is_ai,
      createdAt: row.created_at,
    }));
  }

  const list = (await readList<ChatTalkDoc>(FILES.chats)) ?? [];
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function recordChatTalk(input: {
  id?: string;
  userQuestion: string;
  botReply: string;
  courseSlug?: string | null;
  isAi?: boolean;
}): Promise<ChatTalkDoc> {
  const now = new Date().toISOString();
  const id = input.id ?? randomUUID();

  const doc: ChatTalkDoc = {
    _id: id,
    userQuestion: input.userQuestion,
    botReply: input.botReply,
    score: null,
    courseSlug: input.courseSlug ?? null,
    isAi: input.isAi ?? false,
    createdAt: now,
  };

  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("chat_talks").insert({
      id,
      user_question: doc.userQuestion,
      bot_reply: doc.botReply,
      score: doc.score,
      course_slug: doc.courseSlug,
      is_ai: doc.isAi,
      created_at: now,
    });
    if (error) fail(error, "Could not record chat talk");
    return doc;
  }

  const list = (await readList<ChatTalkDoc>(FILES.chats)) ?? [];
  await writeList(FILES.chats, [doc, ...list]);
  return doc;
}

export async function updateChatTalkScore(
  id: string,
  score: 1 | -1
): Promise<ChatTalkDoc | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("chat_talks")
      .update({ score })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) fail(error, "Could not update talk feedback score");
    if (!data) return null;
    return {
      _id: data.id,
      userQuestion: data.user_question,
      botReply: data.bot_reply,
      score: data.score,
      courseSlug: data.course_slug,
      isAi: data.is_ai,
      createdAt: data.created_at,
    };
  }

  const list = (await readList<ChatTalkDoc>(FILES.chats)) ?? [];
  let updated: ChatTalkDoc | null = null;
  const nextList = list.map((item) => {
    if (item._id === id) {
      updated = { ...item, score };
      return updated;
    }
    return item;
  });

  if (updated) {
    await writeList(FILES.chats, nextList);
  }
  return updated;
}

export async function deleteChatTalkById(id: string) {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("chat_talks").delete().eq("id", id);
    if (error && error.code === PG_INVALID_UUID) return;
    if (error) fail(error, "Could not delete chat talk");
    return;
  }

  const list = (await readList<ChatTalkDoc>(FILES.chats)) ?? [];
  const nextList = list.filter((item) => item._id !== id);
  await writeList(FILES.chats, nextList);
}


