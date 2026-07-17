"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_LINKS, CONTACT } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SiteHeader() {
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
          ? "border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
          : "border-transparent bg-background",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/#home" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
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
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/#admissions">Enroll Now</Link>
          </Button>
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
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <a href={CONTACT.phoneHref}>
                  <Phone className="h-4 w-4" />
                  {CONTACT.phone}
                </a>
              </Button>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/#admissions">Enroll Now</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
