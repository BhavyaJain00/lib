"use client";

import * as React from "react";

export type SidebarPresetKey =
  | "ocean"
  | "graphite"
  | "forest"
  | "amethyst"
  | "sunset"
  | "midnight"
  | "sand"
  | "carbon"
  | "lagoon"
  | "blossom";

export type SidebarTheme = {
  preset: SidebarPresetKey;
  rail: string;
  panel: string;
  text: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  backgroundType: "none" | "pattern" | "image";
  patternName: string;
  patternSize: number;
  patternOpacity: number;
  imageUrl?: string;
};

export type ComponentsTheme = {
  primaryColor: string;
  radius: "square" | "small" | "default" | "large" | "round";
};

export type TableTheme = {
  preset: "default" | "data-dense" | "clean" | "minimal";
  density: "comfortable" | "compact";
  fontSize: "default" | "small";
  zebraStriping: boolean;
  rowHover: boolean;
  gridLines: "full" | "rows" | "none";
  headerText: "uppercase" | "normal";
  rowsPerPage: "all" | "10" | "25" | "50" | "100";
  exportCsv: boolean;
  exportExcel: boolean;
  exportPdf: boolean;
  exportPrint: boolean;
  exportCopy: boolean;
};

export const PRESET_THEMES: Record<SidebarPresetKey, Omit<SidebarTheme, "preset" | "backgroundType" | "patternName" | "patternSize" | "patternOpacity" | "imageUrl">> = {
  ocean: {
    rail: "#1E40AF",
    panel: "#EFF6FF",
    text: "#374151",
    textMuted: "rgba(55, 65, 81, 0.65)",
    accent: "#2563EB",
    accentBg: "rgba(37, 99, 235, 0.12)",
  },
  graphite: {
    rail: "#0F172A",
    panel: "#F8FAFC",
    text: "#334155",
    textMuted: "rgba(51, 65, 85, 0.65)",
    accent: "#0F172A",
    accentBg: "rgba(15, 23, 42, 0.10)",
  },
  forest: {
    rail: "#065F46",
    panel: "#F0FDF4",
    text: "#166534",
    textMuted: "rgba(22, 101, 52, 0.65)",
    accent: "#16A34A",
    accentBg: "rgba(22, 163, 74, 0.12)",
  },
  amethyst: {
    rail: "#6B21A8",
    panel: "#FAF5FF",
    text: "#581C87",
    textMuted: "rgba(88, 28, 135, 0.65)",
    accent: "#9333EA",
    accentBg: "rgba(147, 51, 234, 0.12)",
  },
  sunset: {
    rail: "#9F1239",
    panel: "#FFF1F2",
    text: "#991B1B",
    textMuted: "rgba(153, 27, 27, 0.65)",
    accent: "#E11D48",
    accentBg: "rgba(225, 29, 72, 0.12)",
  },
  midnight: {
    rail: "#090D16",
    panel: "#111827",
    text: "#E5E7EB",
    textMuted: "rgba(229, 231, 235, 0.60)",
    accent: "#3B82F6",
    accentBg: "rgba(59, 130, 246, 0.20)",
  },
  sand: {
    rail: "#78350F",
    panel: "#FFFBEB",
    text: "#78350F",
    textMuted: "rgba(120, 53, 15, 0.65)",
    accent: "#D97706",
    accentBg: "rgba(217, 119, 6, 0.12)",
  },
  carbon: {
    rail: "#18181B",
    panel: "#27272A",
    text: "#F4F4F5",
    textMuted: "rgba(244, 244, 245, 0.60)",
    accent: "#A1A1AA",
    accentBg: "rgba(161, 161, 170, 0.20)",
  },
  lagoon: {
    rail: "#115E59",
    panel: "#F0FDFA",
    text: "#134E4A",
    textMuted: "rgba(19, 78, 74, 0.65)",
    accent: "#0D9488",
    accentBg: "rgba(13, 148, 136, 0.12)",
  },
  blossom: {
    rail: "#9D174D",
    panel: "#FDF2F8",
    text: "#831843",
    textMuted: "rgba(131, 24, 67, 0.65)",
    accent: "#DB2777",
    accentBg: "rgba(219, 39, 119, 0.12)",
  },
};

export const DEFAULT_SIDEBAR_THEME: SidebarTheme = {
  preset: "ocean",
  ...PRESET_THEMES.ocean,
  backgroundType: "none",
  patternName: "dots",
  patternSize: 24,
  patternOpacity: 12,
};

export const DEFAULT_COMPONENTS_THEME: ComponentsTheme = {
  primaryColor: "#2563EB",
  radius: "default",
};

export const DEFAULT_TABLE_THEME: TableTheme = {
  preset: "default",
  density: "comfortable",
  fontSize: "default",
  zebraStriping: false,
  rowHover: true,
  gridLines: "full",
  headerText: "uppercase",
  rowsPerPage: "all",
  exportCsv: true,
  exportExcel: true,
  exportPdf: true,
  exportPrint: true,
  exportCopy: true,
};

interface AppearanceContextType {
  sidebar: SidebarTheme;
  components: ComponentsTheme;
  tables: TableTheme;
  updateSidebar: (partial: Partial<SidebarTheme>) => void;
  updateComponents: (partial: Partial<ComponentsTheme>) => void;
  updateTables: (partial: Partial<TableTheme>) => void;
  resetSidebar: () => void;
  resetComponents: () => void;
  resetTables: () => void;
}

const AppearanceContext = React.createContext<AppearanceContextType | null>(null);

const STORAGE_KEY_SIDEBAR = "navya_admin_appearance_sidebar";
const STORAGE_KEY_COMPONENTS = "navya_admin_appearance_components";
const STORAGE_KEY_TABLES = "navya_admin_appearance_tables";

export function AdminAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [sidebar, setSidebar] = React.useState<SidebarTheme>(DEFAULT_SIDEBAR_THEME);
  const [components, setComponents] = React.useState<ComponentsTheme>(DEFAULT_COMPONENTS_THEME);
  const [tables, setTables] = React.useState<TableTheme>(DEFAULT_TABLE_THEME);

  // Load saved preferences on mount
  React.useEffect(() => {
    try {
      const savedSb = localStorage.getItem(STORAGE_KEY_SIDEBAR);
      if (savedSb) setSidebar(JSON.parse(savedSb));

      const savedComp = localStorage.getItem(STORAGE_KEY_COMPONENTS);
      if (savedComp) setComponents(JSON.parse(savedComp));

      const savedTb = localStorage.getItem(STORAGE_KEY_TABLES);
      if (savedTb) setTables(JSON.parse(savedTb));
    } catch {
      // ignore
    }
  }, []);

  // Apply CSS variables to :root dynamically
  React.useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--sb-rail", sidebar.rail);
    root.style.setProperty("--sb-panel", sidebar.panel);
    root.style.setProperty("--sb-text", sidebar.text);
    root.style.setProperty("--sb-text-muted", sidebar.textMuted);
    root.style.setProperty("--sb-accent", sidebar.accent);
    root.style.setProperty("--sb-accent-bg", sidebar.accentBg);

    // Radius mapping
    const radiusMap: Record<ComponentsTheme["radius"], string> = {
      square: "0px",
      small: "0.25rem",
      default: "0.5rem",
      large: "0.75rem",
      round: "9999px",
    };
    root.style.setProperty("--radius", radiusMap[components.radius]);

    // Primary color hex to HSL if valid
    if (components.primaryColor.startsWith("#")) {
      const hex = components.primaryColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      const hslStr = `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      root.style.setProperty("--primary", hslStr);
      root.style.setProperty("--ring", hslStr);
    }
  }, [sidebar, components]);

  const updateSidebar = (partial: Partial<SidebarTheme>) => {
    setSidebar((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY_SIDEBAR, JSON.stringify(next));
      return next;
    });
  };

  const updateComponents = (partial: Partial<ComponentsTheme>) => {
    setComponents((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY_COMPONENTS, JSON.stringify(next));
      return next;
    });
  };

  const updateTables = (partial: Partial<TableTheme>) => {
    setTables((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(next));
      return next;
    });
  };

  const resetSidebar = () => {
    setSidebar(DEFAULT_SIDEBAR_THEME);
    localStorage.removeItem(STORAGE_KEY_SIDEBAR);
  };

  const resetComponents = () => {
    setComponents(DEFAULT_COMPONENTS_THEME);
    localStorage.removeItem(STORAGE_KEY_COMPONENTS);
  };

  const resetTables = () => {
    setTables(DEFAULT_TABLE_THEME);
    localStorage.removeItem(STORAGE_KEY_TABLES);
  };

  return (
    <AppearanceContext.Provider
      value={{
        sidebar,
        components,
        tables,
        updateSidebar,
        updateComponents,
        updateTables,
        resetSidebar,
        resetComponents,
        resetTables,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAdminAppearance() {
  const context = React.useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAdminAppearance must be used within an AdminAppearanceProvider");
  }
  return context;
}
