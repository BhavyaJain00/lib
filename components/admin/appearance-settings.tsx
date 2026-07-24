"use client";

import * as React from "react";
import {
  Palette,
  RotateCcw,
  Check,
  Upload,
  Layout,
  Table as TableIcon,
  MousePointer,
  FileSpreadsheet,
  FileText,
  Printer,
  Copy,
  Download,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  useAdminAppearance,
  PRESET_THEMES,
  type SidebarPresetKey,
  type ComponentsTheme,
} from "@/components/admin/admin-appearance-provider";

const PRIMARY_SWATCHES = [
  { name: "Royal Blue", hex: "#2563EB" },
  { name: "Indigo", hex: "#4F46E5" },
  { name: "Violet", hex: "#7C3AED" },
  { name: "Purple", hex: "#9333EA" },
  { name: "Fuchsia", hex: "#D946EF" },
  { name: "Rose", hex: "#E11D48" },
  { name: "Red", hex: "#DC2626" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Amber", hex: "#D97706" },
  { name: "Emerald", hex: "#059669" },
  { name: "Teal", hex: "#0D9488" },
  { name: "Cyan", hex: "#0284C7" },
  { name: "Slate", hex: "#475569" },
];

const SVG_PATTERNS = [
  { id: "dots", label: "Dots", svg: "radial-gradient(#3b82f6 1px, transparent 1px)" },
  { id: "grid", label: "Grid", svg: "linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)" },
  { id: "diagonal", label: "Diagonal", svg: "repeating-linear-gradient(45deg, #3b82f6 0, #3b82f6 1px, transparent 0, transparent 50%)" },
  { id: "crosshatch", label: "Crosshatch", svg: "repeating-linear-gradient(0deg, #3b82f6, #3b82f6 1px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, #3b82f6, #3b82f6 1px, transparent 1px, transparent 10px)" },
  { id: "waves", label: "Waves", svg: "radial-gradient(circle at 100% 50%, transparent 20%, #3b82f6 21%, #3b82f6 34%, transparent 35%, transparent)" },
  { id: "chevrons", label: "Chevrons", svg: "linear-gradient(135deg, #3b82f6 25%, transparent 25%), linear-gradient(225deg, #3b82f6 25%, transparent 25%)" },
  { id: "circles", label: "Circles", svg: "radial-gradient(circle, #3b82f6 2px, transparent 3px)" },
  { id: "bricks", label: "Bricks", svg: "linear-gradient(335deg, #3b82f6 23px, transparent 23px), linear-gradient(155deg, #3b82f6 23px, transparent 23px)" },
  { id: "checkerboard", label: "Checkerboard", svg: "conic-gradient(#3b82f6 90deg, transparent 90deg 180deg, #3b82f6 180deg 270deg, transparent 270deg)" },
  { id: "diamonds", label: "Diamonds", svg: "linear-gradient(45deg, #3b82f6 25%, transparent 25%), linear-gradient(-45deg, #3b82f6 25%, transparent 25%)" },
  { id: "lines-vert", label: "Vertical Lines", svg: "linear-gradient(90deg, #3b82f6 1px, transparent 1px)" },
  { id: "lines-horiz", label: "Horizontal Lines", svg: "linear-gradient(0deg, #3b82f6 1px, transparent 1px)" },
];

export function AppearanceSettings() {
  const [activeTab, setActiveTab] = React.useState<"sidebar" | "components" | "tables">("sidebar");
  const {
    sidebar,
    components,
    tables,
    updateSidebar,
    updateComponents,
    updateTables,
    resetSidebar,
    resetComponents,
    resetTables,
  } = useAdminAppearance();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Palette className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Appearance</h1>
          <p className="text-sm text-muted-foreground">
            Personalise the sidebar and the app&apos;s buttons &amp; components. Changes apply instantly and are saved to this device.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("sidebar")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "sidebar"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Sidebar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("components")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "components"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Buttons &amp; Components
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tables")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "tables"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Tables
        </button>
      </div>

      {/* TAB 1: SIDEBAR */}
      {activeTab === "sidebar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Controls */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header & Reset */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Theme presets</h2>
              <button
                type="button"
                onClick={resetSidebar}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset sidebar
              </button>
            </div>
            <p className="text-xs text-muted-foreground -mt-4">
              One-click palettes. Fine-tune any of them below.
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(PRESET_THEMES) as SidebarPresetKey[]).map((key) => {
                const preset = PRESET_THEMES[key];
                const isSelected = sidebar.preset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      updateSidebar({
                        preset: key,
                        ...preset,
                      });
                    }}
                    className={`relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div
                      className="flex h-7 w-6 shrink-0 rounded-md border border-black/10 shadow-sm overflow-hidden"
                      style={{ backgroundColor: preset.panel }}
                    >
                      <div className="w-2 h-full" style={{ backgroundColor: preset.rail }} />
                    </div>
                    <span className="text-xs font-bold capitalize text-foreground flex-1">
                      {key.replace("-", " ")}
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Colours Picker */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-foreground">Colours</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pick exact colours for each part of the sidebar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Icon rail */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Icon rail
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={sidebar.rail}
                      onChange={(e) => updateSidebar({ rail: e.target.value })}
                      className="h-9 w-9 rounded-lg border border-border cursor-pointer p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      value={sidebar.rail}
                      onChange={(e) => updateSidebar({ rail: e.target.value })}
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Panel background */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Panel background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={sidebar.panel.startsWith("#") ? sidebar.panel : "#EFF6FF"}
                      onChange={(e) => updateSidebar({ panel: e.target.value })}
                      className="h-9 w-9 rounded-lg border border-border cursor-pointer p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      value={sidebar.panel}
                      onChange={(e) => updateSidebar({ panel: e.target.value })}
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Navigation text */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Navigation text
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={sidebar.text.startsWith("#") ? sidebar.text : "#374151"}
                      onChange={(e) => updateSidebar({ text: e.target.value })}
                      className="h-9 w-9 rounded-lg border border-border cursor-pointer p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      value={sidebar.text}
                      onChange={(e) => updateSidebar({ text: e.target.value })}
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Accent */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Accent (active item)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={sidebar.accent.startsWith("#") ? sidebar.accent : "#2563EB"}
                      onChange={(e) =>
                        updateSidebar({
                          accent: e.target.value,
                          accentBg: `${e.target.value}20`,
                        })
                      }
                      className="h-9 w-9 rounded-lg border border-border cursor-pointer p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      value={sidebar.accent}
                      onChange={(e) => updateSidebar({ accent: e.target.value })}
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Background Mode (Pattern / None / Image) */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-foreground">Panel background</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Keep it plain, add a subtle pattern, or upload your own image.
                </p>
              </div>

              {/* Segmented control */}
              <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1">
                {(["none", "pattern", "image"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateSidebar({ backgroundType: type })}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all capitalize ${
                      sidebar.backgroundType === type
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type === "none" && <span>🚫 None</span>}
                    {type === "pattern" && <span>✨ Pattern</span>}
                    {type === "image" && <span>🖼️ Image</span>}
                  </button>
                ))}
              </div>

              {/* Patterns Grid */}
              {sidebar.backgroundType === "pattern" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {SVG_PATTERNS.map((pat) => {
                      const isSel = sidebar.patternName === pat.id;
                      return (
                        <button
                          key={pat.id}
                          type="button"
                          onClick={() => updateSidebar({ patternName: pat.id })}
                          className={`relative flex flex-col items-center justify-center rounded-xl border h-20 p-2 transition-all overflow-hidden ${
                            isSel
                              ? "border-primary ring-2 ring-primary/20 shadow-sm"
                              : "border-border bg-card hover:border-muted-foreground/30"
                          }`}
                        >
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: pat.svg,
                              backgroundSize: `${sidebar.patternSize}px ${sidebar.patternSize}px`,
                            }}
                          />
                          <span className="relative z-10 text-[11px] font-bold text-foreground bg-background/80 px-2 py-0.5 rounded">
                            {pat.label}
                          </span>
                          {isSel && (
                            <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-white flex items-center justify-center">
                              <Check className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pattern controls sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Pattern size</span>
                        <span>{sidebar.patternSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        step="2"
                        value={sidebar.patternSize}
                        onChange={(e) => updateSidebar({ patternSize: Number(e.target.value) })}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Pattern opacity</span>
                        <span>{sidebar.patternOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="40"
                        step="2"
                        value={sidebar.patternOpacity}
                        onChange={(e) => updateSidebar({ patternOpacity: Number(e.target.value) })}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Image Upload */}
              {sidebar.backgroundType === "image" && (
                <div className="space-y-3 pt-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={sidebar.imageUrl || ""}
                    onChange={(e) => updateSidebar({ imageUrl: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Enter any direct background image URL for your sidebar panel.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Live Preview Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-foreground">Live preview</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This mirrors your real sidebar.
                </p>
              </div>

              {/* Sidebar Mockup */}
              <div
                className="relative rounded-2xl border border-border overflow-hidden shadow-lg p-3 min-h-[380px] flex flex-col justify-between"
                style={{
                  backgroundColor: sidebar.panel,
                  color: sidebar.text,
                }}
              >
                {sidebar.backgroundType === "pattern" && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: sidebar.patternOpacity / 100,
                      backgroundImage: SVG_PATTERNS.find((p) => p.id === sidebar.patternName)?.svg,
                      backgroundSize: `${sidebar.patternSize}px ${sidebar.patternSize}px`,
                    }}
                  />
                )}

                <div className="relative z-10 space-y-4">
                  {/* Mock Rail / Logo */}
                  <div className="flex items-center gap-2.5 pb-3 border-b border-black/10 dark:border-white/10">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white text-xs font-bold"
                      style={{ backgroundColor: sidebar.rail }}
                    >
                      N
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                      WORKSPACE
                    </span>
                  </div>

                  {/* Nav items */}
                  <div className="space-y-1 text-xs font-semibold">
                    {["Dashboard", "Inventory", "Purchase", "HR", "Reports"].map((item, idx) => {
                      const isActive = idx === 1;
                      return (
                        <div
                          key={item}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all"
                          style={
                            isActive
                              ? {
                                  backgroundColor: sidebar.accentBg,
                                  color: sidebar.accent,
                                  fontWeight: "bold",
                                }
                              : { color: sidebar.text }
                          }
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: isActive ? sidebar.accent : sidebar.text,
                              opacity: isActive ? 1 : 0.4,
                            }}
                          />
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUTTONS & COMPONENTS */}
      {activeTab === "components" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Header & Reset */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Primary colour</h2>
              <button
                type="button"
                onClick={resetComponents}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset components
              </button>
            </div>
            <p className="text-xs text-muted-foreground -mt-4">
              Colours buttons, links, focus rings, switches and active states across the whole app.
            </p>

            {/* Primary Swatches */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex flex-wrap gap-3">
                {PRIMARY_SWATCHES.map((swatch) => {
                  const isSel = components.primaryColor.toUpperCase() === swatch.hex.toUpperCase();
                  return (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => updateComponents({ primaryColor: swatch.hex })}
                      className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-transform ${
                        isSel ? "scale-110 ring-4 ring-primary/30" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    >
                      {isSel && <Check className="h-5 w-5 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Hex Picker */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-muted-foreground">Custom:</span>
                <input
                  type="color"
                  value={components.primaryColor}
                  onChange={(e) => updateComponents({ primaryColor: e.target.value })}
                  className="h-8 w-8 rounded-lg border border-border cursor-pointer p-0.5 bg-background"
                />
                <input
                  type="text"
                  value={components.primaryColor}
                  onChange={(e) => updateComponents({ primaryColor: e.target.value })}
                  className="w-32 rounded-lg border border-input bg-background px-3 py-1 text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Corner Radius Settings */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-foreground">Corner radius</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Roundness of every button, input, card and dropdown.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(
                  [
                    { id: "square", label: "Square", radius: "0px" },
                    { id: "small", label: "Small", radius: "4px" },
                    { id: "default", label: "Default", radius: "8px" },
                    { id: "large", label: "Large", radius: "12px" },
                    { id: "round", label: "Round", radius: "9999px" },
                  ] as const
                ).map((item) => {
                  const isSel = components.radius === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateComponents({ radius: item.id })}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 gap-2 transition-all ${
                        isSel
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div
                        className="h-6 w-6 border-2 border-primary"
                        style={{ borderRadius: item.radius }}
                      />
                      <span className="text-xs font-bold text-foreground">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live Preview Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-foreground">Live preview</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real components, themed instantly.
                </p>
              </div>

              {/* Component Demos */}
              <div className="space-y-4 text-xs">
                {/* BUTTONS */}
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    BUTTONS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-md bg-primary px-3 py-1.5 font-bold text-primary-foreground shadow"
                    >
                      Primary
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-secondary px-3 py-1.5 font-semibold text-secondary-foreground"
                    >
                      Secondary
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-input px-3 py-1.5 font-semibold text-foreground"
                    >
                      Outline
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-3 py-1.5 font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Ghost
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-rose-600 px-3 py-1.5 font-bold text-white shadow"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* BADGES */}
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    BADGES
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-600">
                      Active
                    </span>
                    <span className="rounded-full bg-slate-500/10 px-2.5 py-0.5 font-bold text-slate-600">
                      Draft
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-0.5 font-bold text-foreground">
                      Outline
                    </span>
                    <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 font-bold text-rose-600">
                      Overdue
                    </span>
                  </div>
                </div>

                {/* INPUTS */}
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    INPUTS
                  </span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Text input"
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select className="w-full rounded-md border border-input bg-background px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>PURCHASE ORDER</option>
                      <option>INVOICE</option>
                    </select>
                  </div>
                </div>

                {/* SWITCH & CHECKBOX */}
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent bg-primary transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-4" />
                    </div>
                    <span className="font-semibold text-foreground">Switch</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="flex h-4 w-4 items-center justify-center rounded bg-primary text-white">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="font-semibold text-foreground">Checkbox</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TABLES */}
      {activeTab === "tables" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Header & Reset */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Presets</h2>
              <button
                type="button"
                onClick={resetTables}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset tables
              </button>
            </div>
            <p className="text-xs text-muted-foreground -mt-4">
              One-click starting points. Fine-tune anything below.
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { id: "default", label: "Default", desc: "Balanced spacing, full grid" },
                  { id: "data-dense", label: "Data-dense", desc: "Compact rows, small text" },
                  { id: "clean", label: "Clean", desc: "Airy rows, no vertical lines" },
                  { id: "minimal", label: "Minimal", desc: "No grid lines, hover focus" },
                ] as const
              ).map((preset) => {
                const isSel = tables.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      updateTables({
                        preset: preset.id,
                        density: preset.id === "data-dense" ? "compact" : "comfortable",
                        gridLines: preset.id === "clean" ? "rows" : preset.id === "minimal" ? "none" : "full",
                      })
                    }
                    className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                      isSel
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-foreground">{preset.label}</span>
                      {isSel && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-1">{preset.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Appearance Section */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-foreground">Appearance</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Applies to every table across the app.
                </p>
              </div>

              <div className="space-y-4">
                {/* Density */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Density</span>
                  <div className="inline-flex rounded-lg border border-border bg-muted p-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => updateTables({ density: "comfortable" })}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        tables.density === "comfortable" ? "bg-primary text-white shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      Comfortable
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTables({ density: "compact" })}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        tables.density === "compact" ? "bg-primary text-white shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      Compact
                    </button>
                  </div>
                </div>

                {/* Zebra striping */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Zebra striping</span>
                    <span className="text-[11px] text-muted-foreground">Tint every other row for easier scanning.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tables.zebraStriping}
                    onChange={(e) => updateTables({ zebraStriping: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                {/* Row hover */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Row hover</span>
                    <span className="text-[11px] text-muted-foreground">Highlight the row under the cursor.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tables.rowHover}
                    onChange={(e) => updateTables({ rowHover: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Export & Actions */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-foreground">Export &amp; actions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Which functional buttons appear in each table&apos;s menu.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "exportCsv", label: "CSV", desc: "Comma-separated file (opens in Excel/Sheets)" },
                  { key: "exportExcel", label: "Excel", desc: "Native .xlsx spreadsheet" },
                  { key: "exportPdf", label: "PDF", desc: "Formatted PDF document" },
                  { key: "exportPrint", label: "Print", desc: "Clean printable page / Save as PDF" },
                  { key: "exportCopy", label: "Copy", desc: "Copy selection to clipboard" },
                ].map(({ key, label, desc }) => {
                  const val = Boolean(tables[key as keyof typeof tables]);
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-background"
                    >
                      <div>
                        <span className="text-xs font-bold text-foreground block">{label}</span>
                        <span className="text-[10px] text-muted-foreground">{desc}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => updateTables({ [key]: e.target.checked })}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live Preview Box */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-foreground">Live preview</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  A real table on your live settings.
                </p>
              </div>

              {/* Table Preview Mockup */}
              <div className="rounded-xl border border-border overflow-hidden bg-background shadow">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-2 border-b border-border">Document</th>
                      <th className="p-2 border-b border-border">Vendor</th>
                      <th className="p-2 border-b border-border">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { doc: "PO-0091", vendor: "Acme Steel Co.", status: "Approved" },
                      { doc: "PO-0090", vendor: "Bright Tools Ltd", status: "Pending" },
                      { doc: "PO-0089", vendor: "Corner Hardware", status: "Draft" },
                      { doc: "PO-0088", vendor: "Delta Plastics", status: "Approved" },
                    ].map((row, idx) => (
                      <tr
                        key={row.doc}
                        className={`${
                          tables.zebraStriping && idx % 2 === 1 ? "bg-muted/40" : ""
                        } ${tables.rowHover ? "hover:bg-accent/50" : ""}`}
                      >
                        <td className="p-2 font-mono font-bold text-foreground">{row.doc}</td>
                        <td className="p-2 font-medium text-foreground">{row.vendor}</td>
                        <td className="p-2">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              row.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : row.status === "Pending"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-slate-500/10 text-slate-500"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
