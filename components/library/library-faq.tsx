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
    <section id="faq" className="border-t border-border bg-secondary/10 py-8 sm:py-14 lg:py-16">
      <div className="container-page max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <Badge
            variant="soft"
            className="inline-flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 sm:px-3 sm:py-1 sm:text-xs"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </Badge>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-foreground sm:mt-3 sm:text-3xl">
            Got Questions? <span className="text-emerald-600 dark:text-emerald-400">We've Got Answers</span>
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
            Everything you need to know about shift memberships, trial visits, amenities, and rules.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-6 space-y-2 sm:mt-8 sm:space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Card
                key={index}
                className={cn(
                  "overflow-hidden border transition-all duration-200 rounded-xl",
                  isOpen
                    ? "border-emerald-500/40 bg-card shadow-xs"
                    : "border-border/80 bg-card/60 hover:border-emerald-500/30"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-3 text-left text-xs font-bold text-foreground outline-none sm:p-4 sm:text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                      Q{index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-emerald-600 dark:text-emerald-400"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border/50 bg-secondary/20 p-3 pt-2 text-[11px] leading-relaxed text-muted-foreground sm:p-4 sm:pt-3 sm:text-xs">
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
