import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/auth-shell";
import { AdminLoginForm } from "@/components/admin/login-form";
import { isSignedIn, isAdminConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // Already signed in → straight to the panel.
  if (isAdminConfigured && (await isSignedIn())) redirect("/admin");

  return (
    <AuthShell
      title="Admin Login"
      subtitle="Sign in to manage courses and student queries"
    >
      <AdminLoginForm configured={isAdminConfigured} />
    </AuthShell>
  );
}
