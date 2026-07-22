"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  BookOpen,
  Building2,
  Activity,
  MessageSquare,
  GraduationCap,
  ExternalLink,
  ShieldAlert,
  Menu,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { RefreshAdminButton } from "@/components/admin/refresh-button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Queries", href: "/admin/inquiries", icon: Inbox },
  { label: "Library Seats", href: "/admin/library", icon: Building2 },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Chat Talks", href: "/admin/chats", icon: MessageSquare },
  { label: "Activity", href: "/admin/activity", icon: Activity },
];



export function AdminShell({
  email,
  devMode = false,
  children,
}: {
  email: string;
  devMode?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[264px] flex-col border-r transition-transform lg:static lg:z-auto lg:flex lg:translate-x-0",
          open ? "flex translate-x-0" : "hidden -translate-x-full",
        )}
        style={{
          backgroundColor: "var(--sb-panel)",
          borderColor: "hsl(var(--border))",
          color: "var(--sb-text)",
        }}
      >
        <div
          className="flex h-16 items-center gap-2.5 border-b px-5"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm"
            style={{ backgroundColor: "var(--sb-rail)" }}
          >
            <GraduationCap className="h-5 w-5" />
          </span>
          <div className="leading-none">
            <p className="text-sm font-bold">Navya Admin</p>
            <p className="text-[11px]" style={{ color: "var(--sb-text-muted)" }}>
              Control Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                style={
                  active
                    ? {
                        backgroundColor: "var(--sb-accent-bg)",
                        color: "var(--sb-accent)",
                      }
                    : { color: "var(--sb-text)" }
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3" style={{ borderColor: "hsl(var(--border))" }}>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--sb-text-muted)" }}
          >
            <ExternalLink className="h-[18px] w-[18px]" />
            View live site
          </Link>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Signed in as{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshAdminButton />
            {devMode && (
              <span className="hidden items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 sm:inline-flex">
                <ShieldAlert className="h-3.5 w-3.5" />
                Unlocked (dev)
              </span>
            )}
            <LogoutButton />
          </div>

        </header>

        <main className="flex-1 bg-secondary/30 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
