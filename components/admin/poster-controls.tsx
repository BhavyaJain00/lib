"use client";

import * as React from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { PosterDoc } from "@/lib/db";
import {
  createPosterAction,
  updatePosterAction,
  togglePosterActiveAction,
  reorderPostersAction,
  deletePosterAction,
  type FormState,
} from "@/app/admin/actions";

interface PosterControlsProps {
  posters: PosterDoc[];
}

export function PosterControls({ posters: initialPosters }: PosterControlsProps) {
  const [posters, setPosters] = React.useState<PosterDoc[]>(initialPosters);
  const [editingPoster, setEditingPoster] = React.useState<PosterDoc | null>(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state if server re-renders
  React.useEffect(() => {
    setPosters(initialPosters);
  }, [initialPosters]);

  const activeCount = posters.filter((p) => p.isActive).length;

  // Toggle active status
  const handleToggleActive = async (poster: PosterDoc) => {
    const nextState = !poster.isActive;
    setPosters((prev) =>
      prev.map((p) => (p._id === poster._id ? { ...p, isActive: nextState } : p))
    );

    const res = await togglePosterActiveAction(poster._id, nextState);
    if (!res.ok) {
      // Revert on failure
      setPosters((prev) =>
        prev.map((p) => (p._id === poster._id ? { ...p, isActive: poster.isActive } : p))
      );
      setMessage({ type: "error", text: res.error || "Failed to toggle status." });
    } else {
      setMessage({
        type: "success",
        text: `Poster "${poster.title}" ${nextState ? "activated" : "hidden"}.`,
      });
    }
  };

  // Reorder up / down
  const handleMove = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= posters.length) return;

    const nextList = [...posters];
    const [moved] = nextList.splice(index, 1);
    nextList.splice(newIndex, 0, moved);

    setPosters(nextList);
    const orderedIds = nextList.map((p) => p._id);
    const res = await reorderPostersAction(orderedIds);
    if (!res.ok) {
      setPosters(posters); // revert
      setMessage({ type: "error", text: res.error || "Failed to reorder posters." });
    }
  };

  // Delete poster
  const handleDelete = async (poster: PosterDoc) => {
    if (!confirm(`Are you sure you want to delete "${poster.title}"?`)) return;

    setPosters((prev) => prev.filter((p) => p._id !== poster._id));
    const res = await deletePosterAction(poster._id);
    if (!res.ok) {
      setPosters(posters); // revert
      setMessage({ type: "error", text: res.error || "Failed to delete poster." });
    } else {
      setMessage({ type: "success", text: `Poster "${poster.title}" deleted.` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Sliding Banners & Posters
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {posters.length} Posters ({activeCount} Active)
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage sliding images & announcement posters displayed on the home page.
            <span className="font-semibold text-blue-600 dark:text-blue-400"> (Recommended: 5 to 20 images)</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Poster</span>
        </button>
      </div>

      {/* Message alert */}
      {message && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-700 border border-rose-500/30 dark:text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-500" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Recommendation Notice */}
      {posters.length < 5 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
          <Sparkles className="h-5 w-5 shrink-0 text-amber-500" />
          <span>
            <strong>Tip:</strong> You currently have {posters.length} poster(s). Add up to 5 to 20 sliding posters for a rich interactive experience on your main website.
          </span>
        </div>
      )}

      {/* Posters List */}
      <div className="space-y-3">
        {posters.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="font-semibold text-foreground">No Posters Found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Add New Poster" to upload your first announcement slide.
            </p>
          </div>
        ) : (
          posters.map((poster, index) => (
            <div
              key={poster._id}
              className={`flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl border p-4 transition-all ${
                poster.isActive
                  ? "border-border bg-card shadow-sm"
                  : "border-border/60 bg-muted/40 opacity-75"
              }`}
            >
              {/* Left Info & Image */}
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground shrink-0">
                  #{index + 1}
                </span>

                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                  {poster.imageUrl ? (
                    <Image
                      src={poster.imageUrl}
                      alt={poster.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-foreground truncate text-base">
                      {poster.title}
                    </h3>
                    {poster.badge && (
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                        {poster.badge}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        poster.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-500/10 text-slate-500"
                      }`}
                    >
                      {poster.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {poster.subtitle && (
                    <p className="mt-0.5 text-xs text-muted-foreground truncate max-w-lg">
                      {poster.subtitle}
                    </p>
                  )}

                  {poster.linkUrl && (
                    <p className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 truncate flex items-center gap-1">
                      <LinkIcon className="h-3 w-3 shrink-0" />
                      <span>{poster.linkUrl}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {/* Reorder Buttons */}
                <div className="flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === posters.length - 1}
                    onClick={() => handleMove(index, "down")}
                    className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Toggle Active Button */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(poster)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    poster.isActive
                      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                  title={poster.isActive ? "Hide from website" : "Show on website"}
                >
                  {poster.isActive ? (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      <span>Shown</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setEditingPoster(poster)}
                  className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  title="Edit Poster"
                >
                  <Edit2 className="h-4 w-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(poster)}
                  className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Delete Poster"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Poster Modal */}
      {isAddOpen && (
        <PosterFormModal
          title="Add New Poster Slide"
          onClose={() => setIsAddOpen(false)}
          onSubmit={async (formData) => {
            setIsPending(true);
            const res = await createPosterAction({ status: "idle", message: "" }, formData);
            setIsPending(false);
            if (res.status === "error") {
              setMessage({ type: "error", text: res.message });
            } else {
              setIsAddOpen(false);
            }
          }}
          isPending={isPending}
        />
      )}

      {/* Edit Poster Modal */}
      {editingPoster && (
        <PosterFormModal
          title="Edit Poster Slide"
          poster={editingPoster}
          onClose={() => setEditingPoster(null)}
          onSubmit={async (formData) => {
            setIsPending(true);
            const res = await updatePosterAction(editingPoster._id, { status: "idle", message: "" }, formData);
            setIsPending(false);
            if (res.status === "error") {
              setMessage({ type: "error", text: res.message });
            } else {
              setEditingPoster(null);
            }
          }}
          isPending={isPending}
        />
      )}
    </div>
  );
}

// Sub-component for Add/Edit Modal
interface PosterFormModalProps {
  title: string;
  poster?: PosterDoc;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  isPending: boolean;
}

function PosterFormModal({ title, poster, onClose, onSubmit, isPending }: PosterFormModalProps) {
  const [imagePreview, setImagePreview] = React.useState<string | null>(poster?.imageUrl || null);
  const [urlInput, setUrlInput] = React.useState<string>(poster?.imageUrl || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          action={async (formData) => {
            await onSubmit(formData);
          }}
          className="space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Poster Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              defaultValue={poster?.title || ""}
              required
              placeholder="e.g. RSCIT Govt Computer Batch 2026"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Subtitle / Details */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Subtitle / Description
            </label>
            <textarea
              name="subtitle"
              rows={2}
              defaultValue={poster?.subtitle || ""}
              placeholder="e.g. Essential RKCL certification for Government Job Exams. Limited seats!"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Image Source Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Poster Image File or URL <span className="text-rose-500">*</span>
            </label>

            {/* File Upload input */}
            <div className="flex items-center gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-muted/40 p-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-muted">
                <Upload className="h-4 w-4 text-primary" />
                <span>Upload Image File (PNG, JPG, WebP)</span>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Image URL fallback */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Or paste direct Image URL:</p>
              <input
                type="url"
                name="imageUrl"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Preview Box */}
            {imagePreview && (
              <div className="relative h-36 w-full overflow-hidden rounded-xl border border-border bg-slate-950 mt-2">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Link URL */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Button Action Link (Optional)
              </label>
              <input
                type="text"
                name="linkUrl"
                defaultValue={poster?.linkUrl || ""}
                placeholder="#inquiry or /courses/rscit"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Badge Tag */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Badge / Tag Text
              </label>
              <input
                type="text"
                name="badge"
                defaultValue={poster?.badge || ""}
                placeholder="e.g. New Admission, 100% Placement"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              value="true"
              defaultChecked={poster ? poster.isActive : true}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-xs font-medium text-foreground cursor-pointer">
              Show this poster slide live on website
            </label>
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "Saving..." : poster ? "Update Poster" : "Save Poster"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
