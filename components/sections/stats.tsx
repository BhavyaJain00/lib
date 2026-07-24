import { Users, Handshake, ShieldCheck, Star } from "lucide-react";
import { STATS } from "@/lib/data";

const ICONS = [Users, Handshake, ShieldCheck, Star];

export function Stats() {
  const marqueeItems = [...STATS, ...STATS, ...STATS, ...STATS];

  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      {/* 1. Desktop View (Original Spacious 4-Column Grid) */}
      <div className="hidden sm:block">
        <div className="container-page grid grid-cols-2 gap-x-4 gap-y-8 py-10 sm:gap-8 sm:py-12 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = ICONS[i];
            return (
              <div key={stat.label} className="group flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
                <Icon className="mb-3 h-6 w-6 opacity-90 transition-transform duration-300 group-hover:scale-125 group-hover:opacity-100 sm:h-7 sm:w-7" />
                <span className="text-2xl font-extrabold tracking-tight transition-colors duration-200 sm:text-3xl lg:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm font-medium text-primary-foreground/80">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Mobile View (Compact Marquee Ticker Strip) */}
      <div className="relative overflow-hidden py-2.5 sm:hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-primary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-primary to-transparent" />

        <div className="flex w-max animate-marquee items-center gap-4 hover:[animation-play-state:paused]">
          {marqueeItems.map((stat, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={`${stat.label}-${i}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm"
              >
                <Icon className="h-4 w-4 shrink-0 text-white/90" />
                <span className="text-xs font-extrabold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium text-primary-foreground/90">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
