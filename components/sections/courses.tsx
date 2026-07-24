import Link from "next/link";
import { ArrowRight, Clock, Users, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";
import { getPublicCourses } from "@/lib/db";
import { getIcon } from "@/lib/icons";

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

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {courses.map((course) => {
            const Icon = getIcon(course.icon);
            return (
              <Card
                key={course.slug}
                className="group flex flex-col transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </span>
                    {course.featured && <Badge variant="soft">Popular</Badge>}
                  </div>
                  <CardTitle className="mt-4 text-xl">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                    >
                      {course.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {course.tagline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto space-y-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {course.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      {course.batchSize}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {course.level}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full group-hover:border-primary/40 group-hover:text-primary"
                    >
                      <Link href={`/courses/${course.slug}`}>
                        View Course Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
