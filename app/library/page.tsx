import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  BookOpen,
  Wifi,
  Wind,
  Zap,
  ShieldCheck,
  Clock,
  Coffee,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Phone,
  Sparkles,
  Award,
  Users,
  ArrowRight,
  Armchair,
  VolumeX,
  Camera,
} from "lucide-react";
import { LibraryHeader } from "@/components/library/library-header";
import { LibraryFooter } from "@/components/library/library-footer";
import { AmenitiesSection } from "@/components/library/amenities-section";
import { PlansSection } from "@/components/library/plans-section";
import { SeatVisualizer } from "@/components/library/seat-visualizer";
import { SeatReservationForm } from "@/components/library/seat-reservation-form";
import { LibraryFAQ } from "@/components/library/library-faq";
import { Chatbot } from "@/components/chatbot/chatbot";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { BackToTop } from "@/components/back-to-top";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Navya Library | Quiet Study Sanctuary & AC Reading Hall",
  description:
    "Navya Library offers fully air-conditioned quiet reading halls, personal charging ports, high-speed Wi-Fi, ergonomic seating, and 24/7 access for competitive exam aspirants.",
  alternates: { canonical: "/library" },
};

const MAP_SEARCH_URL =
  "https://www.google.com/maps/search/navya+library/@26.8747182,75.671413,12429m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D";

export default function LibraryPage() {
  return (
    <>
      <LibraryHeader />
      <main id="overview" className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-emerald-500/10 via-background to-background py-16 lg:py-24">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="container-page relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="soft"
                  className="gap-1.5 border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  ISO 9001:2015 Certified Study Sanctuary
                </Badge>

                <Badge
                  variant="outline"
                  className="gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
                >
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Seats Available Today
                </Badge>
              </div>

              <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-[1.15]">
                Focus, Study & Achieve at{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-400">
                  Navya Library
                </span>
              </h1>

              <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg max-w-2xl">
                Jaipur&apos;s premier quiet AC reading hall for UPSC, CA, SSC, Banking, NEET & Competitive Exam aspirants. Equipped with ergonomic high-back chairs, personal power outlets, 500 Mbps fiber Wi-Fi, and 24/7 access.
              </p>

              <div className="flex flex-col gap-3.5 sm:flex-row pt-2">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-7 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-all"
                >
                  <Link href="#reserve">
                    <span>Book Free 1-Day Trial</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 rounded-xl font-bold border-border/80 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <Link href="#plans">Explore Shift Fees</Link>
                </Button>
              </div>

              {/* Stat Counter Highlights Bar */}
              <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-4">
                <div>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</p>
                  <p className="text-xs text-muted-foreground font-medium">Silent AC Zone</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">500 Mbps</p>
                  <p className="text-xs text-muted-foreground font-medium">Optical Fiber</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">500+</p>
                  <p className="text-xs text-muted-foreground font-medium">Happy Aspirants</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">24 / 7</p>
                  <p className="text-xs text-muted-foreground font-medium">Access Facility</p>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <Card className="relative overflow-hidden border border-emerald-500/30 bg-card p-4 sm:p-6 shadow-2xl rounded-3xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Live Status: Open 24 Hours
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase border-emerald-500/30">
                    Jaipur Campus
                  </Badge>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-emerald-500/20 mb-4 shadow-md group">
                  <Image
                    src="/images/library/reading-hall.png"
                    alt="Navya Library Quiet AC Reading Hall"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      AC Silent Reading Hall
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20">
                    <h3 className="font-bold text-foreground flex items-center gap-2 text-xs sm:text-sm">
                      <Armchair className="h-4 w-4 text-emerald-500" />
                      Dedicated Reserved Study Booths
                    </h3>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      Acoustically soundproof side partitions, warm LED lamp, power dock, and high-back lumbar support chair.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/20 p-2 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>7-Stage RO Water</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/20 p-2 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Keycard Access</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/20 p-2 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Daily News & Mag</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/20 p-2 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>24/7 CCTV Camera</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Seat/Zone Visualizer */}
        <SeatVisualizer />

        {/* Section 3: Amenities & Facilities */}
        <AmenitiesSection />

        {/* Section 3b: Reading Hall Photo Gallery */}
        <section className="py-16 border-t border-border/50 bg-background">
          <div className="container-page">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="soft" className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Camera className="h-3.5 w-3.5" />
                Campus Photo Gallery
              </Badge>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Explore Navya Library Facilities
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Take a tour of our quiet AC reading halls, personal cubicles, and refreshment lounge.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <Card className="group overflow-hidden rounded-2xl border border-emerald-500/30 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/library/reading-hall.png"
                    alt="Silent AC Reading Hall"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 text-white text-xs font-bold">
                    Silent AC Reading Zone
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-foreground">Silent AC Reading Hall</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Air-conditioned, dust-free environment with high-back comfortable seating.
                  </p>
                </div>
              </Card>

              <Card className="group overflow-hidden rounded-2xl border border-emerald-500/30 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/library/study-cubicle.png"
                    alt="Personal Study Booth with Power Socket"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 text-white text-xs font-bold">
                    Personal Desk Booth
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-foreground">Personal Study Booths</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Warm LED lamp, individual power outlet, and soundproof side partitions.
                  </p>
                </div>
              </Card>

              <Card className="group overflow-hidden rounded-2xl border border-emerald-500/30 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/library/lounge-zone.png"
                    alt="RO Water & Break Lounge"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 text-white text-xs font-bold">
                    RO Water Lounge
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-foreground">Refreshment &amp; Water Zone</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    7-Stage RO purified water dispenser and clean break lounge.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 4: Membership Plans & Shift Fees */}
        <PlansSection />

        {/* Section 5: Seat Reservation Form */}
        <section id="reserve" className="py-16 lg:py-24 relative">
          <div className="container-page max-w-4xl">
            <SeatReservationForm />
          </div>
        </section>

        {/* Section 7: FAQs */}
        <LibraryFAQ />

        {/* Section 8: Location & Google Maps */}
        <section id="location" className="border-t border-border bg-secondary/20 py-16 lg:py-24">
          <div className="container-page">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge variant="soft" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Easy Access Location
                </Badge>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Visit Navya Library
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Conveniently situated in a peaceful area of Jaipur with broad road access, student food stalls nearby, and ample two-wheeler parking.
                </p>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold text-foreground">Navya Library Address</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        Navya Library Tower, Main Tech Park Area, Jaipur, Rajasthan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold text-foreground">Phone & WhatsApp Helpline</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {CONTACT.phone} (Available 24 Hours)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
                    <a href={MAP_SEARCH_URL} target="_blank" rel="noopener noreferrer">
                      <span>Open Google Maps Location</span>
                      <ExternalLink className="h-4 w-4 ml-1.5" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Google Maps Interactive Representation Card */}
              <Card className="overflow-hidden border border-emerald-500/30 shadow-2xl rounded-3xl">
                <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-400" />
                      <span className="font-bold text-sm">Navya Library on Google Maps</span>
                    </div>
                    <Badge variant="outline" className="border-emerald-400/40 text-emerald-300 text-[10px]">
                      Verified Reading Center
                    </Badge>
                  </div>
                </div>
                <div className="aspect-video w-full bg-muted/60 flex items-center justify-center p-6 text-center">
                  <div className="space-y-3">
                    <MapPin className="mx-auto h-12 w-12 text-emerald-600 animate-bounce" />
                    <p className="text-base font-bold text-foreground">Navya Library — Jaipur Center</p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Click below to open exact directions, view satellite view and turn-by-turn navigation.
                    </p>
                    <Button asChild size="sm" variant="outline" className="rounded-xl border-emerald-500/40 hover:bg-emerald-500/10">
                      <a href={MAP_SEARCH_URL} target="_blank" rel="noopener noreferrer">
                        Get Navigation Directions
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <LibraryFooter />
      <WhatsAppFab />
      <Chatbot mode="library" />
      <BackToTop />
    </>
  );
}
