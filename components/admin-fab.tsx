"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { DraggableFab } from "@/components/ui/draggable-fab";

export function AdminFab() {
  return (
    <DraggableFab className="admin-fab fixed bottom-20 right-6 z-40">
      <Link
        href="/admin"
        aria-label="Open admin panel"
        className="group flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ShieldCheck className="h-5 w-5" />
        <span className="fab-tip pointer-events-none absolute right-14 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Admin Panel 🛡️
        </span>
      </Link>
    </DraggableFab>
  );
}
