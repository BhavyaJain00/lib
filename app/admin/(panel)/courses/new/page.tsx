import { PageHeader } from "@/components/admin/primitives";
import { CourseForm } from "@/components/admin/course-form";

export const dynamic = "force-dynamic";

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Add course"
        description="Create a new course. It appears on the website as soon as it's marked Live."
      />
      <CourseForm />
    </div>
  );
}
