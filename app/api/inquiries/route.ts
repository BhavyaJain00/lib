import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createInquiry, logActivity } from "@/lib/db";

export async function POST(req: Request) {
  try {
    let fullName = "";
    let phone = "";
    let email = "";
    let preferredCourse = "Navya Library Seat Booking";
    let message = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      fullName = String(body.fullName || "").trim();
      phone = String(body.phone || "").trim();
      email = String(body.email || "").trim();
      preferredCourse = String(body.preferredCourse || preferredCourse).trim();
      message = String(body.message || "").trim();
    } else {
      const formData = await req.formData();
      fullName = String(formData.get("fullName") || "").trim();
      phone = String(formData.get("phone") || "").trim();
      email = String(formData.get("email") || "").trim();
      preferredCourse = String(formData.get("preferredCourse") || preferredCourse).trim();
      message = String(formData.get("message") || "").trim();
    }

    if (fullName.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 8) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    await createInquiry({
      fullName,
      phone,
      email: email || null,
      preferredCourse: preferredCourse || null,
      message: message || null,
    });

    await logActivity(
      "inquiry",
      `New inquiry from ${fullName}`,
      { detail: `Interested in ${preferredCourse} (${message})` }
    );

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/library");
    revalidatePath("/admin");

    if (!contentType.includes("application/json")) {
      // Redirect back with success indicator
      return NextResponse.redirect(new URL("/library?reserved=1#reserve", req.url), 303);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Our counselors will contact you immediately to confirm seat availability.",
    });
  } catch (error) {
    console.error("Error in /api/inquiries route:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please call +91 89492 24095." },
      { status: 500 }
    );
  }
}
