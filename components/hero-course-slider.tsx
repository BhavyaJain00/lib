"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HERO_SLIDES } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const INTERVAL = 4000;

export function HeroCourseSlider({
  icons,
}: {
  /** slug -> icon key, resolved on the server so DB courses keep their icon. */
  icons: Record<string, string>;
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Respect users who prefer reduced motion — no auto-rotation for them.
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % HERO_SLIDES.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, [paused, reduced]);

  const active = HERO_SLIDES[index];
  const Icon = getIcon(icons[active.slug]);

  return (
    <div
      className="relative mx-auto max-w-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stacked cards behind, for depth */}
      <div className="absolute inset-0 -rotate-3 rounded-2xl bg-gradient-to-tr from-primary/15 to-chart-2/15" />
      <div className="absolute inset-0 rotate-2 rounded-2xl border border-border bg-card/50" />

      <div
        className="relative rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6"
        aria-live="polite"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-destructive/70" />
            <span className="h-3 w-3 rounded-full bg-chart-4/80" />
            <span className="h-3 w-3 rounded-full bg-chart-2/80" />
          </div>
          <Badge variant="success">{active.tag}</Badge>
        </div>

        {/* Slide body — keyed so it re-animates on every change */}
        <div key={active.slug} className="mt-6 animate-fade-up space-y-4">
          <Link
            href={`/courses/${active.slug}`}
            className="block rounded-lg border border-border bg-secondary/60 p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Now Enrolling
                </p>
                <p className="truncate text-lg font-semibold">{active.title}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {active.subtitle}
            </p>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                style={{ width: `${active.seats}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {active.seats}% seats filled · limited batch
            </p>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Duration
              </p>
              <p className="mt-1 text-lg font-bold text-primary">
                {active.duration}
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-primary" />
                Batch
              </p>
              <p className="mt-1 text-lg font-bold text-primary">Small</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex gap-1.5">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                aria-label={`Show ${s.title}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                )}
              />
            ))}
          </div>
          <Link
            href={`/courses/${active.slug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View course
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
