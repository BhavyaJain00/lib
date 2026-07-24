"use client";

import * as React from "react";
import { Moon, Sun, Laptop, Check, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "dropdown" | "segmented";
  className?: string;
}

export function ThemeToggle({ variant = "dropdown", className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-border bg-background/50" />
    );
  }

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Laptop },
  ] as const;

  // Segmented Pill Variant (3 buttons side-by-side)
  if (variant === "segmented") {
    return (
      <div className={cn("inline-flex rounded-xl border border-border bg-muted/50 p-1 shadow-xs", className)}>
        {options.map(({ id, label, icon: Icon }) => {
          const isSelected = theme === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                isSelected
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown Variant (Default for Header)
  const currentOption = options.find((o) => o.id === theme) || options[2];
  const CurrentIcon =
    theme === "light"
      ? Sun
      : theme === "dark"
      ? Moon
      : Laptop;

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground shadow-xs transition-all hover:bg-accent hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Select theme mode"
      >
        <CurrentIcon className="h-4 w-4 text-primary" />
        <span className="capitalize hidden sm:inline-block">{currentOption.label}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in-80 zoom-in-95">
          <div className="text-[10px] font-bold text-muted-foreground uppercase px-2.5 py-1 tracking-wider">
            Theme Mode
          </div>
          {options.map(({ id, label, icon: Icon }) => {
            const isSelected = theme === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTheme(id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
