"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save, AlertCircle, ArrowLeft, FileText, X } from "lucide-react";
import { saveCourse, type FormState } from "@/app/admin/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dropdown } from "@/components/ui/dropdown";
import { ListEditor } from "@/components/admin/list-editor";
import { ICON_KEYS, getIcon } from "@/lib/icons";
import type { CourseDoc } from "@/lib/db";

const initial: FormState = { status: "idle", message: "" };

/* Preset choices for the dropdown fields. A course saved with a custom value
   (e.g. imported data) still shows it — the current value is added on top. */
const DURATIONS = [
  "1 Month",
  "2 Months",
  "3 Months",
  "4 Months",
  "6 Months",
  "9 Months",
  "12 Months",
];

const BATCH_SIZES = [
  "Max 10 Students",
  "Max 12 Students",
  "Max 15 Students",
  "Max 20 Students",
  "Max 25 Students",
  "Max 30 Students",
];

const LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Beginner to Advanced",
  "All Levels",
];

const CERTIFICATIONS = [
  "RKCL / VMOU Certificate",
  "ISO 9001:2015 Certificate",
  "Industry-Recognized Certificate",
  "Institute Certificate",
];

export function CourseForm({ course }: { course?: CourseDoc }) {
  const [state, action, pending] = useActionState(saveCourse, initial);
  const editing = Boolean(course?._id);

  const [icon, setIcon] = React.useState<string>(course?.icon ?? "BookOpen");
  const PreviewIcon = getIcon(icon);

  return (
    <form action={action} className="course-form">
      {course?._id && <input type="hidden" name="id" value={course._id} />}

      <Card className="course-form-card space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title *">
            <Input name="title" defaultValue={course?.title} required placeholder="RSCIT" />
          </Field>
          <Field label="Slug *" hint="lowercase-with-hyphens, used in the page URL">
            <Input name="slug" defaultValue={course?.slug} required placeholder="rscit" />
          </Field>
        </div>

        <Field label="Tagline">
          <Input
            name="tagline"
            defaultValue={course?.tagline}
            placeholder="Short one-line description shown on the card"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Duration">
            <PresetSelect
              name="duration"
              options={DURATIONS}
              current={course?.duration}
              placeholder="Select duration…"
            />
          </Field>
          <Field label="Batch size">
            <PresetSelect
              name="batchSize"
              options={BATCH_SIZES}
              current={course?.batchSize}
              placeholder="Select batch size…"
            />
          </Field>
          <Field label="Level">
            <PresetSelect
              name="level"
              options={LEVELS}
              current={course?.level}
              placeholder="Select level…"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Certification">
            <PresetSelect
              name="certification"
              options={CERTIFICATIONS}
              current={course?.certification}
              placeholder="Select certificate…"
            />
          </Field>
          <Field label="Icon" hint="Shown on the course card">
            <div className="flex items-center gap-2">
              <Dropdown
                name="icon"
                value={icon}
                onChange={setIcon}
                className="min-w-0 flex-1"
                options={ICON_KEYS.map((k) => ({ value: k, icon: getIcon(k) }))}
              />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PreviewIcon className="h-5 w-5" />
              </span>
            </div>
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first">
            <Input
              name="sortOrder"
              type="number"
              defaultValue={course?.sortOrder ?? 0}
              placeholder="0"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Course image"
            hint="JPG / PNG / WebP, max 4 MB — shown on the course page banner"
          >
            <UploadField
              name="image"
              fileInput="imageFile"
              current={course?.image}
              accept="image/png,image/jpeg,image/webp,image/gif"
              image
            />
          </Field>
          <Field
            label="Course document"
            hint="PDF / DOC, max 8 MB — students download it from the course page"
          >
            <UploadField
              name="document"
              fileInput="documentFile"
              current={course?.document}
              accept=".pdf,.doc,.docx"
            />
          </Field>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Field
            label="Syllabus"
            hint="Modules appear on the course page in this order — press Enter to add the next one"
          >
            <ListEditor
              name="syllabus"
              initial={course?.syllabus}
              placeholder="e.g. Computer Fundamentals & Windows"
              addLabel="Add module"
            />
          </Field>
          <Field
            label="Career prospects"
            hint="Roles students can apply for after this course"
          >
            <ListEditor
              name="careers"
              initial={course?.careers}
              placeholder="e.g. Data Entry Operator"
              addLabel="Add role"
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-6 border-t border-border pt-5">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={course?.isActive ?? true}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            Live (visible on the website)
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={course?.featured ?? false}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            Popular (shows a badge)
          </label>
        </div>

        {state.status === "error" && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <div className="form-actions flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {editing ? "Save changes" : "Create course"}
              </>
            )}
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/courses">
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Link>
          </Button>
        </div>
      </Card>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * File picker with a preview of the currently saved upload. The hidden input
 * carries the saved path (cleared by ✕); picking a new file replaces it on
 * save. Actual writing happens in the server action via lib/uploads.ts.
 */
function UploadField({
  name,
  fileInput,
  current,
  accept,
  image,
}: {
  name: "image" | "document";
  fileInput: string;
  current?: string | null;
  accept: string;
  image?: boolean;
}) {
  const [kept, setKept] = React.useState(current ?? "");
  const fileName = kept.split("/").pop() ?? "";

  return (
    <div className="space-y-2.5">
      <input type="hidden" name={name} value={kept} />

      {kept && (
        <div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-2.5">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={kept}
              alt="Current course image"
              className="h-14 w-20 shrink-0 rounded-md border border-border object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-sm">{fileName}</span>
          <button
            type="button"
            onClick={() => setKept("")}
            aria-label="Remove file"
            title="Remove"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Input
        type="file"
        name={fileInput}
        accept={accept}
        className="h-auto py-2 file:mr-3 file:rounded-md file:bg-primary/10 file:px-3 file:py-1 file:text-primary hover:file:bg-primary/15"
      />
    </div>
  );
}

/** Dropdown over preset choices; an unlisted saved value is kept selectable. */
function PresetSelect({
  name,
  options,
  current,
  placeholder,
}: {
  name: string;
  options: string[];
  current?: string;
  placeholder: string;
}) {
  const opts =
    current && !options.includes(current) ? [current, ...options] : options;
  return (
    <Dropdown
      name={name}
      defaultValue={current ?? ""}
      placeholder={placeholder}
      options={[
        { value: "", label: placeholder },
        ...opts.map((o) => ({ value: o })),
      ]}
    />
  );
}
