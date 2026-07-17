import {
  Monitor,
  Cpu,
  Megaphone,
  Sparkles,
  Code2,
  Calculator,
  Award,
  BookOpen,
  Landmark,
  Briefcase,
  PenTool,
  Database,
  Globe,
  Camera,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons are stored in MongoDB as a plain string key (React components can't be
 * serialised into a database). This registry maps that key back to a Lucide
 * icon for rendering, and powers the icon picker in the admin course form.
 */
export const ICONS = {
  Monitor,
  Cpu,
  Megaphone,
  Sparkles,
  Code2,
  Calculator,
  Award,
  BookOpen,
  Landmark,
  Briefcase,
  PenTool,
  Database,
  Globe,
  Camera,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;

export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

/** Resolves a stored icon key to a component, falling back to a book icon. */
export function getIcon(key?: string | null): LucideIcon {
  if (key && key in ICONS) return ICONS[key as IconKey];
  return BookOpen;
}
