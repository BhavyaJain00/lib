import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/data";

const ITEMS = [
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: CONTACT.address,
    href: undefined,
  },
  {
    icon: Clock,
    label: "Timings",
    value: "Mon – Sat · 9:00 AM – 8:00 PM",
    href: undefined,
  },
];

export function Contact() {
  return (
    <section id="contact" className="contact-compact border-t border-border bg-secondary/40 py-10 sm:py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Contact"
          title="Get in Touch"
          description="Have a question or ready to enroll? Reach out — our team is happy to help you choose the right path."
        />

        {/* Phones: slim horizontal rows. sm and up: the original big cards. */}
        <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <div className="flex h-full items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left shadow-sm transition-colors hover:border-primary/40 sm:flex-col sm:gap-0 sm:p-6 sm:text-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold sm:mt-4">{label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">{value}</p>
                </div>
              </div>
            );
            return href ? (
              <a key={label} href={href} className="block">
                {inner}
              </a>
            ) : (
              <div key={label}>{inner}</div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={CONTACT.phoneHref}>
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>

        {/* Map */}
        <div className="mt-8 overflow-hidden rounded-xl border border-border shadow-sm sm:mt-10">
          <iframe
            title="Navya Computech location on Google Maps"
            src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.address)}&output=embed`}
            className="h-56 w-full sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
