"use client";

import * as React from "react";
import { User, Phone, Mail, Clock, CheckCircle2, Sparkles, ShieldCheck, Zap, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SHIFT_OPTIONS = [
  {
    id: "morning",
    name: "Morning Shift",
    timing: "6:00 AM – 2:00 PM",
    price: "₹799/mo",
    icon: Clock,
  },
  {
    id: "evening",
    name: "Evening Shift",
    timing: "2:00 PM – 10:00 PM",
    price: "₹799/mo",
    icon: Clock,
  },
  {
    id: "fullday",
    name: "Full Day Shift",
    timing: "6:00 AM – 10:00 PM",
    price: "₹1,399/mo",
    popular: true,
    icon: Zap,
  },
  {
    id: "unlimited",
    name: "24/7 Unlimited",
    timing: "Round-the-Clock",
    price: "₹1,799/mo",
    icon: Sparkles,
  },
];

export function SeatReservationForm() {
  const [selectedShift, setSelectedShift] = React.useState("Full Day Shift (6:00 AM – 10:00 PM)");
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      preferredCourse: "Navya Library Seat Booking",
      message: selectedShift,
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message: data.message || "Thank you! Your seat inquiry has been submitted. Our counselors will call you shortly.",
        });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to submit inquiry. Please try again.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "Network error. Please check your connection or call us at +91 89492 24095.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="relative overflow-hidden border border-emerald-500/30 bg-gradient-to-b from-card via-card/95 to-emerald-500/5 p-6 shadow-2xl sm:p-10 rounded-3xl backdrop-blur-sm">
      {/* Decorative Glow background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-teal-500/10 blur-3xl" />

      {/* Card Header */}
      <div className="relative text-center">
        <Badge
          variant="soft"
          className="inline-flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Book A Free 1-Day Trial Seat
        </Badge>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Reserve Your <span className="text-emerald-600 dark:text-emerald-400">Study Seat</span>
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Select your preferred shift timing and fill in your contact details to lock your quiet AC reading booth.
        </p>
      </div>

      <form className="relative mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Interactive Shift Selector Cards */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            1. Select Your Shift Timing *
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SHIFT_OPTIONS.map((shift) => {
              const Icon = shift.icon;
              const isSelected = selectedShift.includes(shift.name);
              return (
                <button
                  key={shift.id}
                  type="button"
                  onClick={() => setSelectedShift(`${shift.name} (${shift.timing})`)}
                  className={cn(
                    "relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 outline-none",
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/30"
                      : "border-border bg-card/60 hover:border-emerald-500/40 hover:bg-accent/50"
                  )}
                >
                  {shift.popular && (
                    <span className="absolute -top-2 right-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg text-xs",
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <p className="mt-2.5 text-sm font-bold leading-snug">{shift.name}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{shift.timing}</p>
                  </div>
                  <p className="mt-3 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {shift.price}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Fields */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            2. Enter Your Details *
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </span>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Rahul Sharma"
                  disabled={loading}
                  className="w-full h-11 rounded-xl border border-input bg-card/80 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  disabled={loading}
                  className="w-full h-11 rounded-xl border border-input bg-card/80 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Email Address (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </span>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                disabled={loading}
                className="w-full h-11 rounded-xl border border-input bg-card/80 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={cn(
              "flex items-start gap-2.5 rounded-xl border p-4 text-sm font-medium",
              status.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            )}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* CTA Button */}
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:scale-[1.01] transition-all disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting Seat Request…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Confirm & Lock Seat Inquiry</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>

        {/* Trust features list */}
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            No Advance Booking Fee
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-emerald-500" />
            Instant Call Confirmation
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Free 1-Day Trial Included
          </span>
        </div>
      </form>
    </Card>
  );
}
