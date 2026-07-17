"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save, AlertCircle, ArrowLeft } from "lucide-react";
import { saveCourse, type FormState } from "@/app/admin/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ICON_KEYS, getIcon } from "@/lib/icons";
import type { CourseDoc } from "@/lib/db";

const initial: FormState = { status: "idle", message: "" };

export function CourseForm({ course }: { course?: CourseDoc }) {
  const [state, action, pending] = useActionState(saveCourse, initial);
  const editing = Boolean(course?._id);

  const [icon, setIcon] = React.useState<string>(course?.icon ?? "BookOpen");
  const PreviewIcon = getIcon(icon);

  return (
    <form action={action}>
      {course?._id && <input type="hidden" name="id" value={course._id} />}

      <Card className="space-y-5 p-6">
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
            <Input name="duration" defaultValue={course?.duration} placeholder="3 Months" />
          </Field>
          <Field label="Batch size">
            <Input name="batchSize" defaultValue={course?.batchSize} placeholder="Max 20 Students" />
          </Field>
          <Field label="Level">
            <Input name="level" defaultValue={course?.level} placeholder="Beginner" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Certification">
            <Input
              name="certification"
              defaultValue={course?.certification}
              placeholder="RKCL / VMOU Certificate"
            />
          </Field>
          <Field label="Icon" hint="Shown on the course card">
            <div className="flex items-center gap-2">
              <Select
                name="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              >
                {ICON_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </Select>
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
          <Field label="Syllabus" hint="One module per line">
            <Textarea
              name="syllabus"
              rows={6}
              defaultValue={course?.syllabus?.join("\n")}
              placeholder={"Module 1\nModule 2\nModule 3"}
            />
          </Field>
          <Field label="Career prospects" hint="One role per line">
            <Textarea
              name="careers"
              rows={6}
              defaultValue={course?.careers?.join("\n")}
              placeholder={"Data Entry Operator\nOffice Assistant"}
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

        <div className="flex items-center gap-3">
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
