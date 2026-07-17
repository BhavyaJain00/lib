import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { isAdminConfigured, getAdminEmail } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // DEV MODE: until admin credentials are configured, the panel is open so you
  // can preview it. Setting ADMIN_EMAIL / ADMIN_PASSWORD / AUTH_SECRET in .env
  // automatically switches the login gate on.
  if (!isAdminConfigured) {
    return (
      <AdminShell email="Dev mode — open access" devMode>
        {children}
      </AdminShell>
    );
  }

  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");

  return <AdminShell email={email}>{children}</AdminShell>;
}
