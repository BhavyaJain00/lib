"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RefreshIconButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  function handleRefresh() {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleRefresh}
      disabled={isRefreshing}
      title="Refresh page"
      aria-label="Refresh page"
      className={className}
    >
      <RefreshCw
        className={`h-4 w-4 transition-transform ${
          isRefreshing ? "animate-spin text-primary" : ""
        }`}
      />
    </Button>
  );
}

export function RefreshAdminButton() {
  return <RefreshIconButton />;
}
