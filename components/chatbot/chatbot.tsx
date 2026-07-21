import { COURSES, type Course } from "@/lib/data";
import { getPublicCourses } from "@/lib/db";
import { ChatWidget } from "@/components/chatbot/chat-widget";

/**
 * Server wrapper for the chat widget. Fetches the live course catalogue
 * and passes the mode prop (computech vs library) down to ChatWidget.
 */
export async function Chatbot({ mode = "computech" }: { mode?: "computech" | "library" }) {
  let courses: Course[];
  try {
    courses = await getPublicCourses();
  } catch {
    courses = COURSES;
  }

  const slim: Course[] = courses.map((c) => ({
    slug: c.slug,
    title: c.title,
    icon: c.icon,
    tagline: c.tagline,
    duration: c.duration,
    batchSize: c.batchSize,
    level: c.level,
    certification: c.certification,
    syllabus: c.syllabus,
    careers: c.careers,
  }));

  return <ChatWidget courses={slim} mode={mode} />;
}
