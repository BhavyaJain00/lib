"use client";

import * as React from "react";
import {
  Sparkles,
  Zap,
  VolumeX,
  Wind,
  Coffee,
  Lightbulb,
  Wifi,
  Armchair,
  CheckCircle2,
  Lock,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ZONES = [
  {
    id: "silent-booths",
    name: "Quiet Silent Cubicles",
    tagline: "Pin-drop silence zone for intense UPSC, CA & Govt Exam study",
    icon: VolumeX,
    capacity: "60 Desks",
    lighting: "Eye-care warm light",
    features: [
      "Sound-dampening acoustic side partitions",
      "Dedicated LED desk lamp with touch dimming",
      "Dual 3-pin power socket for laptops/tablets",
      "Ergonomic mesh high-back chair",
    ],
    idealFor: "UPSC, CA Final, NEET PG, Judicial Services aspirants needing uninterrupted deep work.",
  },
  {
    id: "window-row",
    name: "Natural Light Window Row",
    tagline: "Bright, airy seating with natural light views for fresh thinking",
    icon: Compass,
    capacity: "25 Desks",
    lighting: "Natural Day Light + LED",
    features: [
      "Large double-pane soundproof windows",
      "Spacious desk tabletop for large books/binders",
      "Under-desk leg extension room",
      "Fast charging USB-A & USB-C ports",
    ],
    idealFor: "Aspirants who prefer natural day ambient light and spacious table room.",
  },
  {
    id: "power-zone",
    name: "Tech & Power Workstations",
    tagline: "High-speed Ethernet port & dual charging docks for online learners",
    icon: Zap,
    capacity: "35 Desks",
    lighting: "Bright daylight LED",
    features: [
      "Direct optical fiber LAN cable port available",
      "Ultra-low latency connection for live video classes",
      "Heavy-duty power strips for multi-device setups",
      "Tablet holder attachment",
    ],
    idealFor: "Online batch students, test-series takers, and IT certification aspirants.",
  },
  {
    id: "lounge-station",
    name: "Refreshment & Discussion Lounge",
    tagline: "Relax, grab a cup of tea, or quickly discuss topics with study partners",
    icon: Coffee,
    capacity: "15 Seats",
    lighting: "Warm ambient glow",
    features: [
      "Automatic hot tea & coffee dispenser",
      "7-Stage RO cold & room temp drinking water",
      "Daily newspapers and current affairs table",
      "Comfortable break sofas",
    ],
    idealFor: "Short 10-minute study breaks, meal breaks, and newspaper reading.",
  },
];

export function SeatVisualizer() {
  const [activeZoneId, setActiveZoneId] = React.useState("silent-booths");

  const activeZone = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];
  const ActiveIcon = activeZone.icon;

  return (
    <section className="py-16 lg:py-24 border-t border-border/60 bg-secondary/15 relative overflow-hidden">
      <div className="container-page relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="soft"
            className="inline-flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Interactive Study Hall Map
          </Badge>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Explore Our <span className="text-emerald-600 dark:text-emerald-400">Study Zones</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base leading-relaxed">
            Click on any zone below to preview its specific desk features, lighting setup, and environment.
          </p>
        </div>

        {/* Zone Selector Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {ZONES.map((zone) => {
            const Icon = zone.icon;
            const isSelected = zone.id === activeZoneId;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZoneId(zone.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-200 shadow-sm outline-none",
                  isSelected
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
                    : "border border-border bg-card text-muted-foreground hover:border-emerald-500/40 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{zone.name}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Zone Card Showcase */}
        <div className="mt-10 max-w-4xl mx-auto">
          <Card className="overflow-hidden border border-emerald-500/30 bg-card p-6 sm:p-10 shadow-2xl rounded-3xl relative">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Left Column: Visual Representation Graphic */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-teal-950/90 p-8 text-white text-center shadow-inner">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 ring-4 ring-emerald-500/10">
                  <ActiveIcon className="h-8 w-8" />
                </span>
                <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                  Zone Preview
                </p>
                <h3 className="mt-1 text-xl font-extrabold text-white">{activeZone.name}</h3>
                <p className="mt-2 text-xs text-emerald-200/80 leading-relaxed max-w-xs">
                  {activeZone.tagline}
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-emerald-500/30 pt-4 text-xs">
                  <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 font-semibold text-emerald-300">
                    Capacity: {activeZone.capacity}
                  </span>
                  <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 font-semibold text-emerald-300">
                    {activeZone.lighting}
                  </span>
                </div>
              </div>

              {/* Right Column: Zone Features & Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <Badge variant="outline" className="text-[11px] font-bold border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                    Desk Amenities & Specs
                  </Badge>
                  <h4 className="mt-2 text-xl font-extrabold text-foreground">
                    What makes this zone special?
                  </h4>
                </div>

                <ul className="space-y-3">
                  {activeZone.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-xl border border-border/80 bg-secondary/30 p-4">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider">Best Recommended For:</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {activeZone.idealFor}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
