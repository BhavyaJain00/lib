import { NextResponse } from "next/server";
import { getPublicCourses, recordChatTalk } from "@/lib/db";
import {
  answer,
  answerLibrary,
  buildSystemPrompt,
  buildLibrarySystemPrompt,
  type BotLink,
  type BotReply,
} from "@/lib/chatbot";
import type { Course } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history : [];
    const lastCourseSlug = typeof body.lastCourseSlug === "string" ? body.lastCourseSlug : undefined;
    const mode = body.mode === "library" ? "library" : "computech";

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Load active courses catalogue
    let courses: Course[] = [];
    try {
      courses = await getPublicCourses();
    } catch {
      courses = [];
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const systemPrompt =
      mode === "library" ? buildLibrarySystemPrompt() : buildSystemPrompt(courses);

    let finalReply: BotReply | null = null;
    let isAiResponse = false;


    // 1. Try Gemini API if available
    if (geminiKey) {
      try {
        const contents = [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Understood! I am the Navya Computech AI Assistant. How can I help?" }] },
          ...history.slice(-6).map((h: { role: string; text: string }) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }],
          })),
          { role: "user", parts: [{ text: message }] },
        ];

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) {
            finalReply = postProcessAiReply(aiText, message, courses);
            isAiResponse = true;
          }
        }
      } catch (err) {
        console.error("Gemini API call error:", err);
      }
    }

    // 2. Try OpenAI API if available
    if (!finalReply && openaiKey) {
      try {
        const messages = [
          { role: "system", content: systemPrompt },
          ...history.slice(-6).map((h: { role: string; text: string }) => ({
            role: h.role === "user" ? "user" : "assistant",
            content: h.text,
          })),
          { role: "user", content: message },
        ];

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const aiText = data?.choices?.[0]?.message?.content;
          if (aiText) {
            finalReply = postProcessAiReply(aiText, message, courses);
            isAiResponse = true;
          }
        }
      } catch (err) {
        console.error("OpenAI API call error:", err);
      }
    }

    // 3. Smart Fallback Engine (Runs local rule & knowledge match)
    if (!finalReply) {
      finalReply =
        mode === "library"
          ? answerLibrary(message, { lastCourseSlug })
          : answer(message, courses, { lastCourseSlug });
    }


    // Record talk in database for admin review
    let talkDoc;
    try {
      talkDoc = await recordChatTalk({
        userQuestion: message,
        botReply: finalReply.text,
        courseSlug: finalReply.courseSlug,
        isAi: isAiResponse,
      });
    } catch (e) {
      console.error("Failed to record chat talk in db", e);
    }

    return NextResponse.json({
      ...finalReply,
      isAi: isAiResponse,
      talkId: talkDoc?._id,
    });
  } catch (error) {
    console.error("Error in /api/chat route:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

function postProcessAiReply(aiText: string, userQuery: string, courses: Course[]): BotReply {
  const queryLower = userQuery.toLowerCase();
  const links: BotLink[] = [];

  const matchedCourse = courses.find(
    (c) =>
      queryLower.includes(c.title.toLowerCase()) ||
      queryLower.includes(c.slug.replace(/-/g, " "))
  );

  if (matchedCourse) {
    links.push({ label: `📖 View ${matchedCourse.title}`, href: `/courses/${matchedCourse.slug}` });
    links.push({ label: "💬 WhatsApp Us", href: "https://wa.me/918949224095" });
  } else if (
    queryLower.includes("fee") ||
    queryLower.includes("cost") ||
    queryLower.includes("join") ||
    queryLower.includes("contact") ||
    queryLower.includes("demo")
  ) {
    links.push({ label: "📞 Call Counselors", href: "tel:+918949224095" });
    links.push({ label: "💬 WhatsApp Demo Class", href: "https://wa.me/918949224095" });
  }

  return {
    text: aiText.trim(),
    links: links.length > 0 ? links : undefined,
    courseSlug: matchedCourse?.slug,
  };
}
