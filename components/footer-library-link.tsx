"use client";

import { BookOpen } from "lucide-react";
import { useRouteTransition } from "@/components/route-transition-provider";

export function FooterLibraryLink() {
  const { transitionTo } = useRouteTransition();

  return (
    <button
      type="button"
      onClick={() => transitionTo("/library", "library")}
      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
    >
      <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
      <span>Navya Library Sub-Site 📚</span>
    </button>
  );
}
