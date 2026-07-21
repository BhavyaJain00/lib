"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toggleCourse, deleteCourse } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { cn } from "@/lib/utils";

function Toggle({
  on,
  disabled,
  onClick,
  label,
}: {
  on: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
        on ? "bg-primary" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          on ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export function CourseControls({
  id,
  title,
  isActive,
  featured,
}: {
  id: string;
  title: string;
  isActive: boolean;
  featured: boolean;
}) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const toggle = (field: "isActive" | "featured", value: boolean) =>
    start(async () => {
      const res = await toggleCourse(id, field, value);
      setError(res.ok ? null : (res.error ?? "Failed"));
      router.refresh();
    });

  const handleConfirmDelete = () => {
    start(async () => {
      const res = await deleteCourse(id);
      if (!res.ok) setError(res.error ?? "Failed");
      else setShowModal(false);
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5" title="Visible on the website">
            <Toggle
              on={isActive}
              disabled={pending}
              onClick={() => toggle("isActive", !isActive)}
              label="Toggle visible on site"
            />
            <span className="hidden text-xs text-muted-foreground sm:inline">Live</span>
          </div>
          <div className="flex items-center gap-1.5" title="Show a Popular badge">
            <Toggle
              on={featured}
              disabled={pending}
              onClick={() => toggle("featured", !featured)}
              label="Toggle popular"
            />
            <span className="hidden text-xs text-muted-foreground sm:inline">Popular</span>
          </div>
          <Button asChild variant="ghost" size="icon" className="h-9 w-9">
            <Link href={`/admin/courses/${id}`} aria-label="Edit course">
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => setShowModal(true)}
            disabled={pending}
            aria-label="Delete course"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin text-destructive" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        {error && <p className="max-w-[240px] text-right text-xs text-destructive">{error}</p>}
      </div>

      <ConfirmModal
        isOpen={showModal}
        title={`Delete "${title}"?`}
        description={`Are you sure you want to delete "${title}" permanently? It will be removed from the website catalogue.`}
        confirmText="Delete Course"
        isLoading={pending}
        onConfirm={handleConfirmDelete}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
