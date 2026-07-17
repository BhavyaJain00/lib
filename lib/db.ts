import "server-only";
import { ObjectId, type WithId, type Document } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
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

/* ------------------------------- Serialising ------------------------------- */

/** Mongo documents contain ObjectId/Date — convert to plain JSON for React. */
function plain<T>(doc: WithId<Document>): T {
  const { _id, ...rest } = doc;
  const out: Record<string, unknown> = { _id: String(_id) };
  for (const [k, v] of Object.entries(rest)) {
    out[k] = v instanceof Date ? v.toISOString() : v;
  }
  return out as T;
}

function toObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

/* --------------------------------- Courses -------------------------------- */

/** Courses shown on the public site (active only). Falls back to samples. */
export async function getPublicCourses(): Promise<Course[]> {
  const db = await getDb();
  if (!db) return COURSES;
  try {
    const docs = await db
      .collection(COLLECTIONS.courses)
      .find({ isActive: { $ne: false } })
      .sort({ sortOrder: 1, title: 1 })
      .toArray();
    if (docs.length === 0) return COURSES;
    return docs.map((d) => plain<CourseDoc>(d));
  } catch {
    return COURSES;
  }
}

export async function getPublicCourse(slug: string): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return COURSES.find((c) => c.slug === slug);
  try {
    const doc = await db
      .collection(COLLECTIONS.courses)
      .findOne({ slug, isActive: { $ne: false } });
    if (!doc) {
      // Fall back to a sample course only when the collection is empty,
      // otherwise an admin-deleted course should genuinely 404.
      const count = await db.collection(COLLECTIONS.courses).countDocuments();
      return count === 0 ? COURSES.find((c) => c.slug === slug) : undefined;
    }
    return plain<CourseDoc>(doc);
  } catch {
    return COURSES.find((c) => c.slug === slug);
  }
}

/** Every course including hidden ones — admin only. */
export async function getAllCourses(): Promise<CourseDoc[]> {
  const db = await getDb();
  if (!db) return [];
  const docs = await db
    .collection(COLLECTIONS.courses)
    .find({})
    .sort({ sortOrder: 1, title: 1 })
    .toArray();
  return docs.map((d) => plain<CourseDoc>(d));
}

export async function getCourseById(id: string): Promise<CourseDoc | null> {
  const db = await getDb();
  const oid = toObjectId(id);
  if (!db || !oid) return null;
  const doc = await db.collection(COLLECTIONS.courses).findOne({ _id: oid });
  return doc ? plain<CourseDoc>(doc) : null;
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
};

export async function createCourse(input: CourseInput) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected.");
  const existing = await db
    .collection(COLLECTIONS.courses)
    .findOne({ slug: input.slug });
  if (existing) throw new Error(`A course with slug "${input.slug}" already exists.`);
  await db.collection(COLLECTIONS.courses).insertOne({
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateCourse(id: string, input: CourseInput) {
  const db = await getDb();
  const oid = toObjectId(id);
  if (!db || !oid) throw new Error("Database not connected.");
  const clash = await db
    .collection(COLLECTIONS.courses)
    .findOne({ slug: input.slug, _id: { $ne: oid } });
  if (clash) throw new Error(`Another course already uses slug "${input.slug}".`);
  await db
    .collection(COLLECTIONS.courses)
    .updateOne({ _id: oid }, { $set: { ...input, updatedAt: new Date() } });
}

export async function setCourseField(
  id: string,
  field: "isActive" | "featured",
  value: boolean,
) {
  const db = await getDb();
  const oid = toObjectId(id);
  if (!db || !oid) throw new Error("Database not connected.");
  await db
    .collection(COLLECTIONS.courses)
    .updateOne({ _id: oid }, { $set: { [field]: value, updatedAt: new Date() } });
}

export async function deleteCourseById(id: string) {
  const db = await getDb();
  const oid = toObjectId(id);
  if (!db || !oid) throw new Error("Database not connected.");
  await db.collection(COLLECTIONS.courses).deleteOne({ _id: oid });
}

/* -------------------------------- Inquiries ------------------------------- */

export async function createInquiry(input: {
  fullName: string;
  phone: string;
  email?: string | null;
  preferredCourse?: string | null;
  message?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected.");
  await db.collection(COLLECTIONS.inquiries).insertOne({
    ...input,
    status: "new",
    createdAt: new Date(),
  });
}

export async function getInquiries(): Promise<InquiryDoc[]> {
  const db = await getDb();
  if (!db) return [];
  const docs = await db
    .collection(COLLECTIONS.inquiries)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => plain<InquiryDoc>(d));
}

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  const db = await getDb();
  const oid = toObjectId(id);
  if (!db || !oid) throw new Error("Database not connected.");
  await db
    .collection(COLLECTIONS.inquiries)
    .updateOne({ _id: oid }, { $set: { status } });
}

export async function deleteInquiryById(id: string) {
  const db = await getDb();
  const oid = toObjectId(id);
  if (!db || !oid) throw new Error("Database not connected.");
  await db.collection(COLLECTIONS.inquiries).deleteOne({ _id: oid });
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
    const db = await getDb();
    if (!db) return;
    await db.collection(COLLECTIONS.activity).insertOne({
      type,
      summary,
      detail: opts.detail ?? null,
      actor: opts.actor ?? "visitor",
      createdAt: new Date(),
    });
  } catch {
    // ignore — activity logging is best-effort
  }
}

export async function getActivity(limit = 200): Promise<ActivityDoc[]> {
  const db = await getDb();
  if (!db) return [];
  const docs = await db
    .collection(COLLECTIONS.activity)
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map((d) => plain<ActivityDoc>(d));
}

/* --------------------------------- Counts --------------------------------- */

export async function getCounts() {
  const db = await getDb();
  if (!db) {
    return { inquiries: 0, newInquiries: 0, courses: 0, activity: 0 };
  }
  const [inquiries, newInquiries, courses, activity] = await Promise.all([
    db.collection(COLLECTIONS.inquiries).countDocuments(),
    db.collection(COLLECTIONS.inquiries).countDocuments({ status: "new" }),
    db.collection(COLLECTIONS.courses).countDocuments({ isActive: { $ne: false } }),
    db.collection(COLLECTIONS.activity).countDocuments(),
  ]);
  return { inquiries, newInquiries, courses, activity };
}
