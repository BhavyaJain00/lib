import Link from "next/link";
import { ShieldCheck } from "lucide-react";

/**
 * Floating "Admin" button, sits just above the WhatsApp button at the
 * bottom-right. Quick access to the control panel.
 */
export function AdminFab() {
  return (
    <Link
      href="/admin"
      aria-label="Open admin panel"
      className="group fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ShieldCheck className="h-6 w-6" />
      <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        Admin Panel
      </span>
    </Link>
  );
}
