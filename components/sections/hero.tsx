import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Layers,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroCourseSlider } from "@/components/hero-course-slider";
import { getPublicCourses } from "@/lib/db";
import { HERO_SLIDES } from "@/lib/data";

const VALUE_PROPS = [
  { icon: FlaskConical, label: "100% Practical Labs" },
  { icon: Layers, label: "Govt & Career Tracks" },
  { icon: Clock, label: "Flexible Batch Timings" },
];

export async function Hero() {
  // Resolve each slide's icon from the live catalogue so admin icon changes
  // carry through to the hero.
  const courses = await getPublicCourses();
  const icons: Record<string, string> = {};
  for (const slide of HERO_SLIDES) {
    icons[slide.slug] =
      courses.find((c) => c.slug === slide.slug)?.icon ?? "BookOpen";
  }

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-chart-2/20 blur-3xl" />

      <div className="container-page relative grid gap-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        {/* Copy */}
        <div className="animate-fade-up">
          <Badge variant="soft" className="mb-5 gap-1.5">
            <Star className="h-3.5 w-3.5 fill-current" />
            ISO 9001:2015 Certified · Since 2018
          </Badge>

          <h1 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Master the <span className="text-gradient">Tech Skills</span> of
            Tomorrow
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
            From RSCIT and Tally to Web Development and government exam
            preparation — learn with hands-on labs, expert corporate trainers
            and dedicated placement support.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {VALUE_PROPS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium shadow-sm"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/#courses">
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#admissions">Book a Free Demo</Link>
            </Button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Trusted by 1000+ students · 100% placement support
          </p>
        </div>

        {/* Auto-rotating course cards — desktop only (see app/mobile.css) */}
        <div className="hide-on-mobile animate-fade-in lg:pl-6">
          <HeroCourseSlider icons={icons} />
        </div>
      </div>
    </section>
  );
}
