import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { BackToTop } from "@/components/back-to-top";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CourseJsonLd } from "@/components/json-ld";
import { COURSES, CONTACT } from "@/lib/data";
import { getPublicCourse, getPublicCourses } from "@/lib/db";
import { getIcon } from "@/lib/icons";

// Re-generate every 5 minutes so admin course edits go live without a
// redeploy. Courses created later render on demand.
export const revalidate = 300;

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublicCourse(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.tagline,
    openGraph: { title: `${course.title} | Navya Computech`, description: course.tagline },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getPublicCourse(slug);
  if (!course) notFound();

  const Icon = getIcon(course.icon);
  const allCourses = await getPublicCourses();
  const related = allCourses.filter((c) => c.slug !== course.slug).slice(0, 3);

  const facts = [
    { icon: Clock, label: "Duration", value: course.duration },
    { icon: Users, label: "Batch Size", value: course.batchSize },
    { icon: BookOpen, label: "Level", value: course.level },
    { icon: Award, label: "Certification", value: course.certification },
  ];

  return (
    <>
      <CourseJsonLd
        title={course.title}
        description={course.tagline}
        slug={course.slug}
      />
      <SiteHeader />
      <main>
        {/* Banner */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

          <div className="container-page relative py-12 lg:py-16">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span>/</span>
              <Link href="/#courses" className="hover:text-primary">
                Courses
              </Link>
              <span>/</span>
              <span className="font-medium text-foreground">{course.title}</span>
            </nav>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <Icon className="h-7 w-7" />
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="soft">{course.level}</Badge>
                    {course.featured && <Badge>Popular</Badge>}
                  </div>
                </div>

                <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {course.title}
                </h1>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  {course.tagline}
                </p>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    {course.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    {course.batchSize}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-primary" />
                    Certificate Included
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* Left: details */}
            <div className="space-y-12">
              {/* Quick facts */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {facts.map(({ icon: FactIcon, label, value }) => (
                  <Card key={label} className="p-4 text-center">
                    <FactIcon className="mx-auto mb-2 h-5 w-5 text-primary" />
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium">{value}</p>
                  </Card>
                ))}
              </div>

              {/* Syllabus */}
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Syllabus &amp; Learning Path
                </h2>
                <p className="mt-2 text-muted-foreground">
                  A structured, hands-on curriculum built to take you from
                  fundamentals to a job-ready portfolio.
                </p>
                <ol className="mt-6 space-y-3">
                  {course.syllabus.map((module, i) => (
                    <li
                      key={module}
                      className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 shadow-sm"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium">{module}</p>
                      </div>
                      <CheckCircle2 className="ml-auto mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                    </li>
                  ))}
                </ol>
              </div>

              {/* Careers */}
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Career Prospects
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Roles our graduates are prepared for after completing this
                  track.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {course.careers.map((role) => (
                    <Card key={role} className="flex items-center gap-3 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <GraduationCap className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-medium">{role}</span>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: sticky contact-to-join card */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <Card className="p-6 shadow-md">
                <h3 className="text-lg font-semibold">
                  Interested in this course?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Admissions are handled personally — there are no online
                  payments on this website. Contact us for the fee structure,
                  batch timings and a free demo class.
                </p>

                <div className="mt-6 space-y-3">
                  <Button asChild size="lg" className="w-full">
                    <a href={CONTACT.phoneHref}>
                      <Phone className="h-4 w-4" />
                      Call {CONTACT.phone}
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full">
                    <a
                      href={CONTACT.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp Us
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full">
                    <a href={`mailto:${CONTACT.email}`}>
                      <Mail className="h-4 w-4" />
                      Email Us
                    </a>
                  </Button>
                </div>

                <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                  {[
                    "Free demo class before you decide",
                    "Free study materials",
                    "Live projects & mock tests",
                    "1-on-1 mentorship",
                    "100% placement support",
                  ].map((perk) => (
                    <div key={perk} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </aside>
          </div>
        </section>

        {/* Related courses */}
        <section className="border-t border-border bg-secondary/40 py-12 lg:py-16">
          <div className="container-page">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Explore Other Courses
              </h2>
              <Button asChild variant="ghost" className="text-primary hover:text-primary">
                <Link href="/#courses">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => {
                const RelIcon = getIcon(c.icon);
                return (
                  <Link
                    key={c.slug}
                    href={`/courses/${c.slug}`}
                    className="group block"
                  >
                    <Card className="flex h-full flex-col p-6 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <RelIcon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {c.tagline}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        View course
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10">
              <Button asChild variant="outline">
                <Link href="/#courses">
                  <ArrowLeft className="h-4 w-4" />
                  Back to all courses
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />
      <BackToTop />
    </>
  );
}
