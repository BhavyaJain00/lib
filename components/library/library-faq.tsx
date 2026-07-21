"use client";

import * as React from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Can I take a Free 1-Day Trial Visit before taking membership?",
    answer: "Yes, absolutely! We offer a 100% Free 1-Day Trial Visit. You can reserve your trial seat online or call us directly. Come visit, experience the quiet AC ambience, ergonomic desk, high-speed Wi-Fi, and then decide.",
  },
  {
    question: "What are the exact shift timings available at Navya Library?",
    answer: "We offer 4 flexible shift timing options: Morning Shift (6:00 AM – 2:00 PM), Evening Shift (2:00 PM – 10:00 PM), Full Day Shift (6:00 AM – 10:00 PM), and 24/7 Unlimited Access (round-the-clock).",
  },
  {
    question: "Is Sunday and public holidays open at the library?",
    answer: "Yes! Navya Library is open 365 days a year including Sundays and public holidays so your competitive exam preparation remains consistent.",
  },
  {
    question: "Do I get a fixed reserved desk or is seating first-come-first-served?",
    answer: "For Full Day, 24/7 Unlimited, and active monthly shift members, we assign a dedicated fixed desk booth so you can keep your books and notes setup without worrying about finding a seat each day.",
  },
  {
    question: "Are personal lockers available for keeping books and belongings?",
    answer: "Yes, key-locked personal storage lockers are available at the facility for a nominal monthly fee. Members with 24/7 Unlimited plans receive a complimentary personal locker.",
  },
  {
    question: "What is the Wi-Fi speed and is power backup available during outages?",
    answer: "We have dual high-speed 500 Mbps optical fiber connections. Our reading hall is backed by an automated commercial silent generator / heavy UPS system to ensure zero power interruption for ACs, lights, and sockets.",
  },
];

export function LibraryFAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-16 lg:py-24 border-t border-border bg-secondary/10 relative">
      <div className="container-page max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <Badge
            variant="soft"
            className="inline-flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </Badge>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Got Questions? <span className="text-emerald-600 dark:text-emerald-400">We've Got Answers</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything you need to know about shift memberships, trial visits, amenities, and rules.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-10 space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Card
                key={index}
                className={cn(
                  "overflow-hidden border transition-all duration-200 rounded-2xl",
                  isOpen
                    ? "border-emerald-500/40 bg-card shadow-md"
                    : "border-border/80 bg-card/60 hover:border-emerald-500/30"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-foreground outline-none sm:text-base"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      Q{index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-emerald-600 dark:text-emerald-400"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border/50 bg-secondary/20 p-5 pt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {faq.answer}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
