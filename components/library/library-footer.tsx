"use client";

import Link from "next/link";
import { BookOpen, Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/data";
import { useRouteTransition } from "@/components/route-transition-provider";

export function LibraryFooter() {
  const { transitionTo } = useRouteTransition();

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/library" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Navya <span className="text-emerald-600 dark:text-emerald-400">Library</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              An ISO certified quiet study sanctuary designed for students preparing for competitive exams, CA, UPSC, SSC, Banking, and IT certifications.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Clock className="h-4 w-4" />
              <span>Open 24 Hours / 7 Days a Week</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/library#overview" className="transition-colors hover:text-foreground">
                  About Navya Library
                </Link>
              </li>
              <li>
                <Link href="/library#amenities" className="transition-colors hover:text-foreground">
                  Reading Hall Facilities
                </Link>
              </li>
              <li>
                <Link href="/library#plans" className="transition-colors hover:text-foreground">
                  Shift Fees & Memberships
                </Link>
              </li>
              <li>
                <Link href="/library#reserve" className="transition-colors hover:text-foreground">
                  Free 1-Day Trial Seat
                </Link>
              </li>
              <li>
                <Link href="/library#location" className="transition-colors hover:text-foreground">
                  Google Maps Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Computech Sister Institute */}
          <div>
            <h4 className="text-sm font-semibold">Sister Institute</h4>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Looking for professional computer training & government certifications?
            </p>
            <button
              type="button"
              onClick={() => transitionTo("/", "computech")}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:underline"
            >
              Navya Computech Institute
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold">Contact & Location</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Navya Library, Main Tech Park Area, Jaipur / Rajasthan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <a href={CONTACT.phoneHref} className="hover:text-foreground">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-foreground">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Navya Library. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>ISO 9001:2015 Certified Study Center</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
