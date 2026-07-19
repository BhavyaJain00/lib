import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { getAllCourses } from "@/lib/db";
import { getIcon } from "@/lib/icons";
import {
  PageHeader,
  TableCard,
  EmptyState,
} from "@/components/admin/primitives";
import { CourseControls } from "@/components/admin/course-controls";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await getAllCourses();

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Add or edit courses — anything marked Live appears on the website automatically."
        action={
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus className="h-4 w-4" />
              Add course
            </Link>
          </Button>
        }
      />

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Add your first course now — it appears on the website instantly."
        />
      ) : (
        <TableCard>
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Level</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Duration</th>
              <th className="px-4 py-3 text-right font-medium">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((c) => {
              const Icon = getIcon(c.icon);
              return (
                <tr key={c._id} className={c.isActive ? "" : "opacity-50"}>
                  <td className="px-4 py-4 text-muted-foreground">{c.sortOrder}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.image}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-lg border border-border object-cover"
                        />
                      ) : (
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/admin/courses/${c._id}`}
                          className="font-medium hover:text-primary"
                        >
                          {c.title}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          /courses/{c.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-sm md:table-cell">
                    {c.level || "—"}
                  </td>
                  <td className="hidden px-4 py-4 text-sm lg:table-cell">
                    {c.duration || "—"}
                  </td>
                  <td className="px-4 py-4">
                    <CourseControls
                      id={c._id}
                      title={c.title}
                      isActive={c.isActive}
                      featured={Boolean(c.featured)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableCard>
      )}
    </div>
  );
}
