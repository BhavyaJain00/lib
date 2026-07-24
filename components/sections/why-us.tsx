import { UserCog, FlaskConical, BadgeCheck, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { WHY_US, BENEFITS } from "@/lib/data";

const ICONS = [UserCog, FlaskConical, BadgeCheck];

export function WhyUs() {
  return (
    <section id="why-us" className="border-y border-border bg-secondary/40 py-12 sm:py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Training Built for Real Careers"
          description="We don't just teach tools — we prepare you for the workplace with mentorship, live projects and certifications that employers trust."
        />

        <div className="why-us-grid mt-12 grid gap-6 md:grid-cols-3">
          {WHY_US.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <Card key={item.title} className="why-us-card group p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold transition-colors duration-200 group-hover:text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="mt-10 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8 transition-all duration-300 hover:shadow-md hover:border-primary/30">
          <h3 className="text-center text-lg font-semibold">
            Every Enrollment Includes
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="group flex items-center gap-2.5 text-sm transition-transform duration-200 hover:translate-x-1">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary transition-transform duration-200 group-hover:scale-125" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
