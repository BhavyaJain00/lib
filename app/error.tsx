"use client";

import Link from "next/link";
import { RotateCcw, Home, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <Frown className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again — if it keeps happening,
        call us at +91 89492 24095.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={() => reset()}>
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
