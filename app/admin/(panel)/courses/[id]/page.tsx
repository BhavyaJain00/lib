import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/db";
import { PageHeader } from "@/components/admin/primitives";
import { CourseForm } from "@/components/admin/course-form";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Edit course"
        description={`Editing “${course.title}”. Changes go live on the website within a few minutes.`}
      />
      <CourseForm course={course} />
    </div>
  );
}
