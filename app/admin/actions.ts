"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  requireAdmin,
  checkCredentials,
  createSession,
  destroySession,
  isAdminConfigured,
} from "@/lib/auth";
import {
  createCourse,
  updateCourse,
  setCourseField,
  deleteCourseById,
  getCourseById,
  setInquiryStatus,

  deleteInquiryById,
  deleteChatTalkById,
  logActivity,

  type InquiryStatus,
  type CourseInput,
} from "@/lib/db";
import { saveUpload } from "@/lib/uploads";
import { ICON_KEYS, type IconKey } from "@/lib/icons";

export type ActionResult = { ok: boolean; error?: string };
export type FormState = { status: "idle" | "error"; message: string };

function lines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Busts the cache for every public page that shows the catalogue. */
function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/courses/[slug]", "page");
  revalidatePath("/library", "page");
  revalidatePath("/sitemap.xml");
}

function revalidateAdmin(...paths: string[]) {
  revalidatePath("/admin");
  paths.forEach((p) => revalidatePath(p));
}

/* ---------------------------------- Auth ---------------------------------- */

export async function signIn(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isAdminConfigured) {
    return {
      status: "error",
      message:
        "Admin login isn't configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET in .env.",
    };
  }
  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }
  if (!checkCredentials(email, password)) {
    return { status: "error", message: "Incorrect email or password." };
  }

  await createSession(email);
  await logActivity("admin_login", `Admin signed in`, { actor: email });
  redirect("/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}

/* -------------------------------- Inquiries ------------------------------- */

const STATUSES: InquiryStatus[] = ["new", "contacted", "enrolled", "closed"];

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<ActionResult> {
  const actor = await requireAdmin();
  if (!STATUSES.includes(status)) return { ok: false, error: "Invalid status." };

  try {
    await setInquiryStatus(id, status);
    await logActivity("inquiry_status", `Query marked "${status}"`, {
      actor: actor ?? "admin",
    });
    revalidateAdmin("/admin/inquiries", "/admin/activity");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  const actor = await requireAdmin();

  try {
    await deleteInquiryById(id);
    await logActivity("inquiry_deleted", "Query deleted", {
      actor: actor ?? "admin",
    });
    revalidateAdmin("/admin/inquiries", "/admin/activity");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/* ---------------------------------- Courses -------------------------------- */

function readCourseForm(formData: FormData): CourseInput | { error: string } {
  const iconRaw = String(formData.get("icon") ?? "BookOpen");
  const icon = (ICON_KEYS as string[]).includes(iconRaw)
    ? (iconRaw as IconKey)
    : ("BookOpen" as IconKey);

  const input: CourseInput = {
    slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
    title: String(formData.get("title") ?? "").trim(),
    icon,
    tagline: String(formData.get("tagline") ?? "").trim(),
    duration: String(formData.get("duration") ?? "").trim(),
    batchSize: String(formData.get("batchSize") ?? "").trim(),
    level: String(formData.get("level") ?? "").trim(),
    certification: String(formData.get("certification") ?? "").trim(),
    syllabus: lines(String(formData.get("syllabus") ?? "")),
    careers: lines(String(formData.get("careers") ?? "")),
    featured: formData.get("featured") === "on",
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
    // Hidden fields holding the already-uploaded paths ("" = removed).
    image: String(formData.get("image") ?? "").trim() || null,
    document: String(formData.get("document") ?? "").trim() || null,
  };

  if (!input.title) return { error: "Title is required." };
  if (!input.slug) return { error: "Slug is required." };
  if (!/^[a-z0-9-]+$/.test(input.slug))
    return {
      error: "Slug may only contain lowercase letters, numbers and hyphens.",
    };
  return input;
}

export async function saveCourse(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const actor = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const parsed = readCourseForm(formData);
  if ("error" in parsed) return { status: "error", message: parsed.error };

  try {
    // A newly chosen file replaces whatever the hidden field pointed at.
    const imageFile = formData.get("imageFile");
    if (imageFile instanceof File && imageFile.size > 0) {
      parsed.image = await saveUpload(imageFile, "image");
    }
    const documentFile = formData.get("documentFile");
    if (documentFile instanceof File && documentFile.size > 0) {
      parsed.document = await saveUpload(documentFile, "doc");
    }

    if (id) {
      await updateCourse(id, parsed);
      await logActivity("course_updated", `Course updated: ${parsed.title}`, {
        actor: actor ?? "admin",
      });
    } else {
      await createCourse(parsed);
      await logActivity("course_created", `Course created: ${parsed.title}`, {
        actor: actor ?? "admin",
      });
    }
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }

  revalidateAdmin("/admin/courses", "/admin/activity");
  revalidatePublic();
  redirect("/admin/courses");
}

export async function toggleCourse(
  id: string,
  field: "isActive" | "featured",
  value: boolean,
): Promise<ActionResult> {
  const actor = await requireAdmin();

  try {
    const course = await getCourseById(id);
    await setCourseField(id, field, value);
    await logActivity(
      "course_updated",
      `${course?.title ?? "Course"} — ${field === "isActive" ? (value ? "shown on site" : "hidden from site") : value ? "marked popular" : "unmarked popular"}`,
      { actor: actor ?? "admin" },
    );
    revalidateAdmin("/admin/courses", "/admin/activity");
    revalidatePublic();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  const actor = await requireAdmin();

  try {
    const course = await getCourseById(id);
    await deleteCourseById(id);
    await logActivity("course_deleted", `Course deleted: ${course?.title ?? id}`, {
      actor: actor ?? "admin",
    });
    revalidateAdmin("/admin/courses", "/admin/activity");
    revalidatePublic();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteChatTalk(id: string): Promise<ActionResult> {
  const actor = await requireAdmin();

  try {
    await deleteChatTalkById(id);
    await logActivity("chat_talk_deleted", "Chat conversation log deleted", {
      actor: actor ?? "admin",
    });
    revalidateAdmin("/admin/chats", "/admin/activity");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

