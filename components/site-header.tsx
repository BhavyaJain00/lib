"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu, Phone, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { RefreshIconButton } from "@/components/admin/refresh-button";
import { NAV_LINKS, CONTACT } from "@/lib/data";
import { cn } from "@/lib/utils";



import { useRouteTransition } from "@/components/route-transition-provider";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { transitionTo } = useRouteTransition();

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
          ? "border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
          : "border-transparent bg-background",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/#home"
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={(e) => {
            setOpen(false);
          }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">
              Navya <span className="text-primary">Computech</span>
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              ISO 9001:2015 Certified
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => transitionTo("/library", "library")}
            className="ml-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-all hover:scale-105 hover:bg-emerald-500/20 dark:text-emerald-300 shadow-sm"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>Library 📚</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground xl:inline-flex"
          >
            <a href={CONTACT.phoneHref}>
              <Phone className="h-4 w-4" />
              {CONTACT.phone}
            </a>
          </Button>
          <ThemeToggle />
          <RefreshIconButton />
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-nav animate-slide-down border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-[15px] font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-primary active:bg-accent"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                transitionTo("/library", "library");
              }}
              className="my-1 flex cursor-pointer items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-[15px] font-bold text-emerald-700 transition-transform duration-200 hover:scale-[1.01] dark:text-emerald-300"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Navya Library Sub-Site 📚
              </span>
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-extrabold text-white uppercase">
                New
              </span>
            </button>
            <div className="mt-3 space-y-3 border-t border-border pt-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Appearance Mode
                </span>
                <ThemeToggle variant="segmented" />
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <a href={CONTACT.phoneHref}>
                    <Phone className="h-4 w-4" />
                    {CONTACT.phone}
                  </a>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

