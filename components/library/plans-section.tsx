"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Sparkles, Clock, Zap, Shield, ArrowRight, Sun, Moon, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "morning",
    name: "Morning Shift",
    timing: "6:00 AM – 2:00 PM",
    duration: "8 Hours / Day",
    price: "799",
    period: "per month",
    popular: false,
    icon: Sun,
    badgeText: "Early Bird Aspirants",
    features: [
      "Reserved Personal Desk Booth",
      "500 Mbps Optical Fiber Wi-Fi",
      "Dedicated Power Socket at Desk",
      "RO Drinking Water & Tea Access",
      "Daily Newspaper & Magazine Access",
      "Full AC Silent Study Ambience",
    ],
  },
  {
    id: "evening",
    name: "Evening Shift",
    timing: "2:00 PM – 10:00 PM",
    duration: "8 Hours / Day",
    price: "799",
    period: "per month",
    popular: false,
    icon: Moon,
    badgeText: "Afternoon & Night Focus",
    features: [
      "Reserved Personal Desk Booth",
      "500 Mbps Optical Fiber Wi-Fi",
      "Dedicated Power Socket at Desk",
      "RO Drinking Water & Tea Access",
      "Daily Newspaper & Magazine Access",
      "Full AC Silent Study Ambience",
    ],
  },
  {
    id: "fullday",
    name: "Full Day Shift",
    timing: "6:00 AM – 10:00 PM",
    duration: "16 Hours / Day",
    price: "1,399",
    period: "per month",
    popular: true,
    icon: Zap,
    badgeText: "Best Value • Aspirant Favorite",
    features: [
      "Guaranteed Fixed Desk Booth",
      "Priority Unlimited Fiber Wi-Fi",
      "Personal Charging & Warm Light",
      "Discounted Personal Locker",
      "Seamless Access to Both Shifts",
      "Continuous Uninterrupted Desk Access",
    ],
  },
  {
    id: "unlimited",
    name: "24/7 Unlimited",
    timing: "Round the Clock",
    duration: "24 Hours Access",
    price: "1,799",
    period: "per month",
    popular: false,
    icon: Sparkles,
    badgeText: "Night Shift & Intensive Exam Prep",
    features: [
      "24-Hour Smart Access Keycard",
      "Dedicated Fixed Personal Desk",
      "Free Personal Storage Locker Included",
      "Priority High-Speed Wi-Fi & Power",
      "Night Shift Study Access",
      "Emergency Security & CCTV Active",
    ],
  },
];

export function PlansSection() {
  return (
    <section id="plans" className="relative py-16 lg:py-24 border-t border-border bg-background">
      <div className="container-page relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="soft"
            className="inline-flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <Award className="h-3.5 w-3.5" />
            Transparent Pricing • Zero Hidden Fees
          </Badge>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Flexible <span className="text-emerald-600 dark:text-emerald-400">Shift Membership Plans</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base leading-relaxed">
            Choose the shift schedule that fits your daily study routine. Book a seat or start with a <strong>Free 1-Day Trial Visit</strong>.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 backdrop-blur-sm",
                  plan.popular
                    ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-500/10 via-card to-card shadow-2xl shadow-emerald-500/15 scale-[1.02] sm:scale-105 z-20"
                    : "border border-border/80 bg-card hover:border-emerald-500/40 hover:shadow-lg"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1 text-[11px] font-extrabold text-white uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl text-sm",
                        plan.popular
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground">
                      {plan.duration}
                    </Badge>
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold text-foreground">{plan.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{plan.timing}</span>
                  </div>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-foreground">₹{plan.price}</span>
                    <span className="text-xs font-medium text-muted-foreground">/{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="mt-6 space-y-2.5 border-t border-border/60 pt-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mt-0.5">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-border/40">
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "w-full rounded-xl font-bold text-xs tracking-wide transition-all",
                      plan.popular
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30"
                        : "bg-secondary text-foreground hover:bg-emerald-600 hover:text-white"
                    )}
                  >
                    <Link href="#reserve">
                      <span>Reserve This Shift</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Sub-note */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <Shield className="h-4 w-4" /> 1-Day Free Trial Available
            </span>
            •
            <span>Personal Lockers Available at ₹199/month add-on</span>
            •
            <span>Group discounts available for 3+ friends</span>
          </p>
        </div>
      </div>
    </section>
  );
}
