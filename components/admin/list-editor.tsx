"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Row-based editor for list fields (syllabus modules, career roles): one input
 * per entry with reorder/remove controls and an add button. Pressing Enter in
 * a row inserts the next one. The value is submitted through a hidden input as
 * newline-joined text, so the server action keeps reading a single field —
 * exactly like the old textarea it replaces.
 */
export function ListEditor({
  name,
  initial,
  placeholder,
  addLabel,
}: {
  name: string;
  initial?: string[];
  placeholder?: string;
  addLabel: string;
}) {
  const [items, setItems] = React.useState<string[]>(
    initial && initial.length > 0 ? initial : [""],
  );
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const setItem = (i: number, value: string) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? value : it)));

  const insertAfter = (i: number) => {
    setItems((prev) => [...prev.slice(0, i + 1), "", ...prev.slice(i + 1)]);
    requestAnimationFrame(() => inputsRef.current[i + 1]?.focus());
  };

  const remove = (i: number) =>
    setItems((prev) =>
      prev.length === 1 ? [""] : prev.filter((_, idx) => idx !== i),
    );

  const move = (i: number, dir: -1 | 1) =>
    setItems((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const submitted = items.map((s) => s.trim()).filter(Boolean).join("\n");

  return (
    <div className="list-editor space-y-2">
      <input type="hidden" name={name} value={submitted} />

      {items.map((item, i) => (
        <div key={i} className="list-editor-row flex items-center gap-1.5">
          <span className="row-num flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
            {i + 1}
          </span>
          <Input
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            value={item}
            onChange={(e) => setItem(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                insertAfter(i);
              }
            }}
            placeholder={i === 0 ? placeholder : undefined}
            className="flex-1"
          />
          <RowButton
            label="Move up"
            disabled={i === 0}
            onClick={() => move(i, -1)}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </RowButton>
          <RowButton
            label="Move down"
            disabled={i === items.length - 1}
            onClick={() => move(i, 1)}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </RowButton>
          <RowButton
            label="Remove"
            onClick={() => remove(i)}
            className="hover:border-destructive/40 hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </RowButton>
        </div>
      ))}

      <button
        type="button"
        onClick={() => insertAfter(items.length - 1)}
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-input text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

function RowButton({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35 sm:h-8 sm:w-8 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
