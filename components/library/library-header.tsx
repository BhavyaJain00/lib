"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Phone, ArrowLeft, Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { RefreshIconButton } from "@/components/admin/refresh-button";
import { CONTACT } from "@/lib/data";
import { cn } from "@/lib/utils";

const LIBRARY_NAV = [
  { label: "Overview", href: "/library#overview" },
  { label: "Amenities", href: "/library#amenities" },
  { label: "Membership Plans", href: "/library#plans" },
  { label: "Reserve Seat", href: "/library#reserve" },
  { label: "Location", href: "/library#location" },
  { label: "FAQs", href: "/library#faq" },
];

export function LibraryHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
          : "border-transparent bg-background"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/library" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">
              Navya <span className="text-emerald-600 dark:text-emerald-400">Library</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Quiet Study Sanctuary
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {LIBRARY_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-xs text-muted-foreground hover:text-foreground md:inline-flex"
          >
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5" />
              Computech Institute
            </Link>
          </Button>

          <ThemeToggle />
          <RefreshIconButton />

          <Button asChild size="sm" className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/library#reserve">Book Seat</Link>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {LIBRARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-border">
              <Button asChild variant="outline" size="sm" onClick={() => setOpen(false)}>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Navya Computech Institute
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setOpen(false)}>
                <Link href="/library#reserve">Book Trial Seat</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
