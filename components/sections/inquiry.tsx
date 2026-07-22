"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  CalendarClock,
  BadgeCheck,
} from "lucide-react";
import { submitInquiry, type FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SectionHeading } from "@/components/section-heading";

const initialState: FormState = { status: "idle", message: "" };

const PROMISES = [
  { icon: PhoneCall, text: "We call you back within 24 hours" },
  { icon: CalendarClock, text: "Free counseling & demo session" },
  { icon: BadgeCheck, text: "No pressure — pick the right course for you" },
];

export function Inquiry({ courseTitles }: { courseTitles: string[] }) {
  const [state, formAction, isPending] = useActionState(
    submitInquiry,
    initialState,
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <section id="query" className="border-t border-border bg-secondary/40 py-12 sm:py-16 lg:py-24">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left copy */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="Have a Question?"
              title="Send Us Your Query"
              description="Tell us a little about yourself and the course you're interested in. Our counselors will get back to you — this is only an enquiry, there's no payment on this website."
            />
            <ul className="mt-8 space-y-4">
              {PROMISES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <form ref={formRef} action={formAction} className="space-y-5">
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 ..."
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredCourse">Preferred Course / Program</Label>
                <Select
                  id="preferredCourse"
                  name="preferredCourse"
                  defaultValue=""
                  disabled={isPending}
                >
                  <option value="">Select a course or library seat</option>
                  <option value="Navya Library (AC Reading Hall)">Navya Library (AC Reading Hall Seat)</option>
                  {courseTitles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Any questions or preferred batch timings?"
                  disabled={isPending}
                />
              </div>

              {state.status !== "idle" && (
                <div
                  role="status"
                  className={
                    "flex items-start gap-2 rounded-md border p-3 text-sm " +
                    (state.status === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-destructive/30 bg-destructive/10 text-destructive")
                  }
                >
                  {state.status === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>{state.message}</span>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Query
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By submitting, you agree to be contacted about our courses.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
