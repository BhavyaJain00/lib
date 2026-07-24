import { Phone, Mail, MessageCircle, PhoneCall, CalendarClock, GraduationCap, Award } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT } from "@/lib/data";

const STEPS = [
  {
    icon: PhoneCall,
    title: "1. Call or WhatsApp us",
    text: "Tell us which course interests you. Our counselors answer every question.",
  },
  {
    icon: CalendarClock,
    title: "2. Attend a free demo class",
    text: "Visit the institute, sit in a live class, see the labs — completely free.",
  },
  {
    icon: GraduationCap,
    title: "3. Join your batch",
    text: "Pick a batch timing that suits you. Study materials included.",
  },
  {
    icon: Award,
    title: "4. Get certified & placed",
    text: "Complete practical projects, earn certificate & get placement support.",
  },
];

export function Admissions() {
  return (
    <section id="admissions" className="py-12 sm:py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Admissions"
          title="How to Join a Course"
          description="Enrollment is simple and personal — no online payments on this website. Contact us directly and we'll guide you from your first call to your first class."
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 lg:grid-cols-4 sm:gap-6">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-3 text-center sm:p-6 flex flex-col items-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-12 sm:w-12">
                <Icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
              </span>
              <h3 className="mt-3 text-xs font-bold leading-tight sm:text-base sm:font-semibold">{title}</h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground sm:text-sm">{text}</p>
            </Card>
          ))}
        </div>

        {/* Direct contact strip */}
        <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-6 text-center sm:p-8">
          <h3 className="text-lg font-semibold">Ready to start? Talk to us today</h3>
          <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
            Admissions are open — reach us on any of these and we&apos;ll book
            your free demo class.
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={CONTACT.phoneHref}>
                <Phone className="h-4 w-4" />
                {CONTACT.phone}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full min-w-0 sm:w-auto">
              <a href={`mailto:${CONTACT.email}`}>
                <Mail className="h-4 w-4" />
                <span className="truncate">{CONTACT.email}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
