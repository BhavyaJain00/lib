import { CONTACT } from "@/lib/data";
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
        foundingDate: "2018",
      }}
    />
  );
}

/** Course schema — rendered on each course detail page. */
export function CourseJsonLd({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        name: title,
        description,
        url: `${SITE_URL}/courses/${slug}`,
        provider: {
          "@type": "EducationalOrganization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      }}
    />
  );
}
