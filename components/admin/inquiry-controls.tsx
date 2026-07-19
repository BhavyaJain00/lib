"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { updateInquiryStatus, deleteInquiry } from "@/app/admin/actions";
import type { InquiryStatus } from "@/lib/db";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";

const STATUSES: InquiryStatus[] = ["new", "contacted", "enrolled", "closed"];

export function InquiryControls({
  id,
  status,
}: {
  id: string;
  status: InquiryStatus;
}) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function changeStatus(next: string) {
    start(async () => {
      const res = await updateInquiryStatus(id, next as InquiryStatus);
      if (!res.ok) setError(res.error ?? "Failed");
      else setError(null);
      router.refresh();
    });
  }

  function remove() {
    if (!confirm("Delete this query permanently?")) return;
    start(async () => {
      const res = await deleteInquiry(id);
      if (!res.ok) setError(res.error ?? "Failed");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Dropdown
          value={status}
          onChange={changeStatus}
          disabled={pending}
          className="w-[130px]"
          triggerClassName="h-9 sm:h-9"
          aria-label="Query status"
          options={STATUSES.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={remove}
          disabled={pending}
          aria-label="Delete query"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && <p className="max-w-[220px] text-right text-xs text-destructive">{error}</p>}
    </div>
  );
}
