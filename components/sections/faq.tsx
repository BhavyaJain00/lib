import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { FAQS } from "@/lib/data";

export function Faq() {
  return (
    <section id="faq" className="section-compact-mobile border-t border-border py-12 sm:py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Everything students and parents usually ask us before enrolling. Still unsure? Call us — we're happy to help."
        />

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:mt-12 lg:grid-cols-2">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="faq-card group h-fit rounded-lg border border-border bg-card shadow-sm open:border-primary/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-left font-medium [&::-webkit-details-marker]:hidden sm:p-5">
                <span>{faq.q}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:text-primary" />
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pb-5">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
