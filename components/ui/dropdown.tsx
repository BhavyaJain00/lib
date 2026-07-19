"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption = {
  value: string;
  /** Text shown for the option — falls back to `value`. */
  label?: string;
  /** Optional leading icon, shown in the list and on the trigger. */
  icon?: React.ComponentType<{ className?: string }>;
};

/** Where the option list is placed relative to the trigger (fixed coords). */
type ListPosition = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
};

/**
 * Custom-styled dropdown replacing the native <select> popup (which browsers
 * don't let CSS style). A hidden input carries the value, so it drops into
 * plain <form> submissions exactly like a native select: pass `name` +
 * `defaultValue` for forms, or `value` + `onChange` to control it. Supports
 * keyboard navigation (arrows / Enter / Escape / Home / End).
 *
 * The list renders in a portal with fixed positioning — it can't be clipped
 * by overflow containers (e.g. the admin tables) and flips upward when there
 * isn't enough room below the trigger.
 */
export function Dropdown({
  options,
  name,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  disabled,
  className,
  triggerClassName,
  "aria-label": ariaLabel,
}: {
  options: DropdownOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  "aria-label"?: string;
}) {
  const listId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<ListPosition | null>(null);
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const selected = value ?? internal;
  const selectedIdx = options.findIndex((o) => o.value === selected);
  const [active, setActive] = React.useState(selectedIdx);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const current = selectedIdx >= 0 ? options[selectedIdx] : undefined;
  const isPlaceholder = !current || current.value === "";
  const CurrentIcon = current?.icon;

  const measure = React.useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    const GAP = 6;
    const EDGE = 8;
    const spaceBelow = window.innerHeight - r.bottom - GAP - EDGE;
    const spaceAbove = r.top - GAP - EDGE;
    const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
    setPos({
      left: r.left,
      width: r.width,
      maxHeight: Math.max(120, Math.min(240, openUp ? spaceAbove : spaceBelow)),
      ...(openUp
        ? { bottom: window.innerHeight - r.top + GAP }
        : { top: r.bottom + GAP }),
    });
  }, []);

  const openList = () => {
    measure();
    setActive(selectedIdx >= 0 ? selectedIdx : 0);
    setOpen(true);
  };

  const choose = (option: DropdownOption) => {
    if (value === undefined) setInternal(option.value);
    onChange?.(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Close when clicking/tapping outside the trigger and the portaled list.
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t) && !listRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Track the trigger while any ancestor scrolls or the window resizes.
  React.useEffect(() => {
    if (!open) return;
    const update = () => measure();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, measure]);

  // Keep the keyboard-highlighted option visible while scrolling the list.
  React.useEffect(() => {
    if (!open || active < 0) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[active]) choose(options[active]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={selected} />}

      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:text-sm",
          triggerClassName,
        )}
      >
        <span
          className={cn(
            "flex min-w-0 items-center gap-2",
            isPlaceholder && "text-muted-foreground",
          )}
        >
          {CurrentIcon && <CurrentIcon className="h-4 w-4 shrink-0 text-primary" />}
          <span className="truncate">
            {isPlaceholder ? placeholder : current?.label ?? current?.value}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-50 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            style={{
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
            }}
            className="fixed z-50 overflow-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 duration-100"
          >
            {options.map((o, i) => {
              const isSelected = o.value === selected && o.value !== "";
              const OptIcon = o.icon;
              return (
                <li
                  key={o.value || "__placeholder"}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => choose(o)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                      i === active && "bg-muted",
                      o.value === "" && "text-muted-foreground",
                      isSelected && "font-medium text-primary",
                    )}
                  >
                    {OptIcon && <OptIcon className="h-4 w-4 shrink-0" />}
                    <span className="flex-1 truncate">{o.label ?? o.value}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
