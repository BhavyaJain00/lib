"use server";

import { revalidatePath } from "next/cache";
import { isDbConfigured } from "@/lib/mongodb";
import { createInquiry, logActivity } from "@/lib/db";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitInquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const preferredCourse = String(formData.get("preferredCourse") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  // Honeypot — bots fill hidden fields.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success", message: "Thank you! We'll be in touch soon." };
  }

  if (fullName.length < 2)
    return { status: "error", message: "Please enter your full name." };
  if (phone.replace(/\D/g, "").length < 8)
    return { status: "error", message: "Please enter a valid phone number." };
  if (email && !EMAIL_RE.test(email))
    return { status: "error", message: "Please enter a valid email address." };

  if (!isDbConfigured) {
    return {
      status: "success",
      message:
        "Thanks! Your query was received (demo mode — connect MongoDB to store it).",
    };
  }

  try {
    await createInquiry({
      fullName,
      phone,
      email: email || null,
      preferredCourse: preferredCourse || null,
      message: message || null,
    });

    await logActivity(
      "inquiry",
      `New query from ${fullName}`,
      {
        detail: preferredCourse
          ? `Interested in ${preferredCourse}`
          : "No course selected",
      },
    );

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin");

    return {
      status: "success",
      message: "Thank you! Our team will contact you within 24 hours.",
    };
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Please call us at +91 89492 24095.",
    };
  }
}
