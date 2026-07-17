"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { signIn, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: FormState = { status: "idle", message: "" };

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(signIn, initial);

  if (!configured) {
    return (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-amber-700 dark:text-amber-400">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Admin login isn&apos;t configured yet. Add{" "}
            <code className="rounded bg-muted px-1">ADMIN_EMAIL</code>,{" "}
            <code className="rounded bg-muted px-1">ADMIN_PASSWORD</code> and{" "}
            <code className="rounded bg-muted px-1">AUTH_SECRET</code> to your{" "}
            <code className="rounded bg-muted px-1">.env</code>, then restart the
            server.
          </span>
        </div>
        <p>
          Until then the panel is open in dev mode — you can open{" "}
          <Link href="/admin" className="font-medium text-primary hover:underline">
            /admin
          </Link>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@navyacomputech.com"
          required
          autoComplete="email"
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          disabled={pending}
        />
      </div>

      {state.status === "error" && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
