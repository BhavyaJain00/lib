import Link from "next/link";
import type { Metadata } from "next";
import {
  Award,
  Target,
  Eye,
  Heart,
  History,
  ArrowRight,
  CheckCircle2,
  Users,
  GraduationCap,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { BackToTop } from "@/components/back-to-top";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATS } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Navya Computech is an ISO 9001:2015 certified computer training institute, empowering students since 2018 with practical, career-focused education.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Navya Computech",
    description:
      "ISO 9001:2015 certified computer training institute, empowering students since 2018 with practical, career-focused education.",
    url: "/about",
    type: "website",
  },
};

const VALUES = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To bridge the gap between classroom theory and real workplace skills, so every student graduates confident and job-ready.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To be the region's most trusted launchpad for tech careers — the place families recommend to each other for a reason.",
  },
  {
    icon: Heart,
    title: "Our Values",
    text: "Small batches, patient teaching, honest guidance and support that continues long after the course ends.",
  },
];

// SAMPLE trainer profiles — replace with your real team.
const TRAINERS = [
  {
    name: "Lead Trainer — Web & AI",
    experience: "10+ years in software development",
    focus: "Web Development · AI & Prompt Engineering",
  },
  {
    name: "Senior Trainer — Accounts",
    experience: "12+ years in accounting & taxation",
    focus: "Tally Prime & GST · Advance Computer",
  },
  {
    name: "Trainer — Digital Growth",
    experience: "8+ years running brand campaigns",
    focus: "Digital Marketing · Analytics",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Banner */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="container-page relative py-14 text-center lg:py-20">
            <Badge variant="soft" className="gap-1.5">
              <History className="h-3.5 w-3.5" />
              Since 2018
            </Badge>
            <h1 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Practical Tech Education,{" "}
              <span className="text-gradient">Taught with Care</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Navya Computech is an ISO 9001:2015 certified computer training
              institute. We started in 2018 with a simple belief: anyone can
              master technology when it&apos;s taught hands-on, patiently, and
              with a clear career goal in sight.
            </p>
          </div>
        </section>

        {/* Story + ISO */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container-page grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Our Story"
                title="From One Classroom to 1000+ Careers"
              />
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  We began with a single lab and a handful of students who
                  wanted more than textbook lessons. Word spread the way it
                  does when teaching is honest — through results.
                </p>
                <p>
                  Today, over a thousand students have trained with us: school
                  leavers picking up their first computer skills, graduates
                  becoming developers and marketers, shop owners digitising
                  their businesses, and professionals upgrading to AI-powered
                  workflows.
                </p>
                <p>
                  What hasn&apos;t changed is how we teach — small batches,
                  a dedicated workstation for every student, and trainers who
                  stay with you until the concept clicks.
                </p>
              </div>
              <ul className="mt-6 space-y-2.5">
                {[
                  "ISO 9001:2015 certified quality management",
                  "100% lab-oriented, practice-first classes",
                  "Placement support until you're placed",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <Card className="p-6 sm:p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">
                ISO 9001:2015 Certified
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Our certification isn&apos;t a sticker on the wall — it means our
                curriculum, assessments and student support follow an audited
                quality system, and the certificate you earn carries weight
                with employers.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Mission / Vision / Values */}
        <section className="border-y border-border bg-secondary/40 py-12 sm:py-16 lg:py-20">
          <div className="container-page">
            <SectionHeading
              eyebrow="What Drives Us"
              title="Mission, Vision & Values"
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <Card key={title} className="p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trainers */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container-page">
            <SectionHeading
              eyebrow="Meet the Team"
              title="Trainers from the Industry"
              description="Every trainer has real corporate experience — they teach what employers actually expect, not just what's in the syllabus."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {TRAINERS.map((t) => (
                <Card key={t.name} className="p-6 text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-8 w-8" />
                  </span>
                  <h3 className="mt-4 font-semibold">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.experience}</p>
                  <Badge variant="soft" className="mt-3">
                    {t.focus}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary py-12 text-primary-foreground sm:py-16">
          <div className="container-page flex flex-col items-center gap-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <GraduationCap className="h-7 w-7" />
            </span>
            <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Come see the labs for yourself — book a free demo class
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/#admissions">
                  Book Free Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/#courses">Browse Courses</Link>
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
