"use client";

import * as React from "react";
import {
  Wind,
  Zap,
  Wifi,
  ShieldCheck,
  Coffee,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  VolumeX,
  Lightbulb,
  Armchair,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const AMENITIES = [
  {
    icon: Wind,
    title: "100% AC Reading Halls",
    badge: "Climate Controlled",
    description: "Fully air-conditioned, dust-free, and soundproof silent study sanctuary for non-stop focus.",
    highlights: ["Centralized Cooling", "Air Purified", "Zero Street Noise"],
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Personal Power Socket",
    badge: "Individual Desk",
    description: "Dedicated 5V/220V power outlets and personal warm LED reading lamps at every booth.",
    highlights: ["Laptop Charging", "Independent LED Light", "Surge Protection"],
    color: "amber",
  },
  {
    icon: Wifi,
    title: "500 Mbps Fiber Internet",
    badge: "Ultra Fast",
    description: "Unlimited high-speed optical fiber Wi-Fi with dual backup connections for video lectures.",
    highlights: ["Dual ISP Backup", "High Bandwidth", "Zero Lag Video"],
    color: "cyan",
  },
  {
    icon: ShieldCheck,
    title: "24/7 CCTV & Personal Lockers",
    badge: "Maximum Security",
    description: "Round-the-clock HD CCTV surveillance and key-secured personal storage lockers.",
    highlights: ["HD Surveillance", "Lockable Cabinets", "Biometric/Card Entry"],
    color: "purple",
  },
  {
    icon: Coffee,
    title: "Tea & RO Water Lounge",
    badge: "Refreshment Zone",
    description: "Dedicated break room equipped with 7-stage RO drinking water and hot tea/coffee facility.",
    highlights: ["7-Stage RO Water", "Tea/Coffee Machine", "Clean Washrooms"],
    color: "rose",
  },
  {
    icon: BookOpen,
    title: "Newspapers & Mag Stand",
    badge: "Updated Daily",
    description: "Daily national Hindi & English newspapers, monthly UPSC/SSC current affairs magazines.",
    highlights: ["The Hindu & IE", "Dainik Bhaskar", "Monthly Magazines"],
    color: "blue",
  },
];

export function AmenitiesSection() {
  return (
    <section id="amenities" className="relative py-16 lg:py-24 overflow-hidden border-t border-border/50 bg-secondary/10">
      {/* Glow ambient backgrounds */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/3 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="container-page relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="soft"
            className="inline-flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            World-Class Infrastructure
          </Badge>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Designed for <span className="text-emerald-600 dark:text-emerald-400">Peak Concentration</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base leading-relaxed">
            Every desk at Navya Library is crafted to eliminate distractions so you can study longer with comfort, light, power, and high-speed connectivity.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border border-border/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-border">
                      {item.badge}
                    </Badge>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <ul className="space-y-1.5">
                    {item.highlights.map((hl, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Feature Banner Bar */}
        <div className="mt-12 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/80 via-emerald-900/90 to-teal-950/80 p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <Armchair className="h-6 w-6" />
            </span>
            <div>
              <p className="text-base font-bold text-emerald-100">Ergonomic High-Back Cushion Chairs</p>
              <p className="text-xs text-emerald-200/80 leading-relaxed mt-0.5">
                Padded lumbar support for 8–16 hours of continuous study without back strain.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-emerald-200 shrink-0">
            <span className="flex items-center gap-1.5">
              <VolumeX className="h-4 w-4 text-emerald-400" />
              Pin-Drop Silence
            </span>
            <span className="flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-emerald-400" />
              Eye-Care Warm Light
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
