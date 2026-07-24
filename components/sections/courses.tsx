import { SectionHeading } from "@/components/section-heading";
import { getPublicCourses } from "@/lib/db";
import { CoursesGrid } from "@/components/courses-grid";

export async function Courses() {
  const courses = await getPublicCourses();

  return (
    <section id="courses" className="section-compact-mobile py-12 sm:py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Our Courses"
          title="Career-Focused Training Tracks"
          description="Industry-aligned programs designed with live projects, weekly mock tests and placement workshops — so you graduate job-ready. Contact us for fees and batch availability."
        />

        <CoursesGrid courses={courses} />
      </div>
    </section>
  );
}
