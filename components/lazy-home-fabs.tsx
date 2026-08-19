"use client";

import dynamic from "next/dynamic";

/**
 * Client-side wrapper that lazy-loads homepage floating action buttons.
 * Deferring these non-critical UI elements reduces initial JS hydration bundle size.
 */
const WhatsAppFabLazy = dynamic(
  () => import("@/components/whatsapp-fab").then((m) => ({ default: m.WhatsAppFab })),
  { ssr: false }
);

const AdminFabLazy = dynamic(
  () => import("@/components/admin-fab").then((m) => ({ default: m.AdminFab })),
  { ssr: false }
);

const BackToTopLazy = dynamic(
  () => import("@/components/back-to-top").then((m) => ({ default: m.BackToTop })),
  { ssr: false }
);

export function LazyHomeFabs() {
  return (
    <>
      <WhatsAppFabLazy />
      <AdminFabLazy />
      <BackToTopLazy />
    </>
  );
}
