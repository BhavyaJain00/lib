import { CONTACT, FAQS } from "@/lib/data";
import { SITE_NAME, SITE_URL } from "@/lib/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** EducationalOrganization schema — rendered once on the home page. */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon`,
        description:
          "ISO 9001:2015 certified computer training institute offering career-focused courses with practical labs and placement support.",
        telephone: CONTACT.phone,
        email: CONTACT.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: CONTACT.address,
          addressCountry: "IN",
        },
        areaServed: "IN",
        foundingDate: "2018",
        // Matches the timings shown in the Contact section.
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "20:00",
          },
        ],
      }}
    />
  );
}

/** FAQPage schema — mirrors the FAQ section; eligible for rich results. */
export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

/** BreadcrumbList schema — mirrors the visible breadcrumb trail. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${SITE_URL}${item.href}`,
        })),
      }}
    />
  );
}

/** Course schema — rendered on each course detail page. */
export function CourseJsonLd({
  title,
  description,
  slug,
  level,
  syllabus,
  duration,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  level?: string;
  syllabus?: string[];
  duration?: string;
  image?: string | null;
}) {
  // "3 Months" → ISO 8601 "P3M"; anything unparseable is simply omitted.
  const months = duration?.match(/(\d+)\s*month/i)?.[1];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        name: title,
        description,
        url: `${SITE_URL}/courses/${slug}`,
        ...(level ? { educationalLevel: level } : {}),
        ...(syllabus && syllabus.length > 0 ? { teaches: syllabus } : {}),
        ...(months ? { timeRequired: `P${months}M` } : {}),
        ...(image ? { image: `${SITE_URL}${image}` } : {}),
        provider: {
          "@type": "EducationalOrganization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      }}
    />
  );
}
