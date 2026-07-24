"use client";

import { useFormStatus } from "react-dom";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { useRouteTransition } from "@/components/route-transition-provider";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { transitionTo } = useRouteTransition();

  return (
    <Button
      type="submit"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => transitionTo("/", "computech")}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      Sign out
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={signOut}>
      <SubmitButton />
    </form>
  );
}
