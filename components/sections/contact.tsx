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
    <section id="contact" className="border-t border-border bg-secondary/40 py-12 sm:py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Contact"
          title="Get in Touch"
          description="Have a question or ready to enroll? Reach out — our team is happy to help you choose the right path."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <div className="flex h-full flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-colors hover:border-primary/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm font-semibold">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{value}</p>
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

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={CONTACT.phoneHref}>
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>

        {/* Map */}
        <div className="mt-10 overflow-hidden rounded-xl border border-border shadow-sm">
          <iframe
            title="Navya Computech location on Google Maps"
            src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.address)}&output=embed`}
            className="h-72 w-full sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
