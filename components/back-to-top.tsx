"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { DraggableFab } from "@/components/ui/draggable-fab";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <DraggableFab
      className={cn(
        "back-to-top-fab fixed bottom-6 left-6 z-40 transition-all",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur transition-transform hover:scale-110 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </DraggableFab>
  );
}
