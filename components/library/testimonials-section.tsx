"use client";

import * as React from "react";
import { Star, Quote, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    name: "Vikram Rathore",
    targetExam: "UPSC CSE Aspirant",
    examBadge: "Cleared Prelims 2025",
    shift: "Full Day Shift",
    text: "Navya Library was a game-changer for my UPSC preparation. The strict pin-drop silence and high-back chair allowed me to study 12 hours daily without distraction. The high-speed Wi-Fi was essential for watching online lectures.",
    rating: 5,
    avatarColor: "bg-emerald-600",
  },
  {
    name: "Pooja Sharma",
    targetExam: "CA Final Student",
    examBadge: "Rank 42 Aspirant",
    shift: "Morning Shift",
    text: "The environment here is extremely disciplined and motivating. Everyone around you is studying deeply. Having my own power socket and reading lamp at the booth makes studying so smooth.",
    rating: 5,
    avatarColor: "bg-teal-600",
  },
  {
    name: "Manish Meena",
    targetExam: "SSC CGL Aspirant",
    examBadge: "Selected Inspector",
    shift: "24/7 Unlimited",
    text: "I used the night shift access extensively during the last 3 months before my exams. CCTV security and clean RO water facility made it super safe and comfortable even late at night.",
    rating: 5,
    avatarColor: "bg-emerald-700",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 border-t border-border bg-background relative overflow-hidden">
      <div className="container-page relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="soft"
            className="inline-flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <Award className="h-3.5 w-3.5" />
            Student Reviews & Success Stories
          </Badge>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Trusted by <span className="text-emerald-600 dark:text-emerald-400">500+ Aspirants</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base leading-relaxed">
            See how Navya Library helped serious competitive exam aspirants achieve quiet concentration and success.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => (
            <Card
              key={idx}
              className="relative flex flex-col justify-between border border-border/80 bg-card p-6 shadow-md hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 rounded-3xl"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-emerald-500/15 pointer-events-none" />

              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground italic">
                  "{item.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm ${item.avatarColor}`}
                >
                  {item.name[0]}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-foreground">{item.name}</p>
                  <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {item.targetExam} • {item.examBadge}
                  </p>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Shift: {item.shift}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
