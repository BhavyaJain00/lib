import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Courses } from "@/components/sections/courses";
import { WhyUs } from "@/components/sections/why-us";
import { Faq } from "@/components/sections/faq";
import { Admissions } from "@/components/sections/admissions";
import { Inquiry } from "@/components/sections/inquiry";
import { Contact } from "@/components/sections/contact";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { AdminFab } from "@/components/admin-fab";
import { BackToTop } from "@/components/back-to-top";
import { OrganizationJsonLd } from "@/components/json-ld";
import { getPublicCourses } from "@/lib/db";

// Re-generate every 5 minutes so admin edits go live without a redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const courses = await getPublicCourses();

  return (
    <>
      <OrganizationJsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <Courses />
        <WhyUs />
        <Faq />
        <Admissions />
        <Inquiry courseTitles={courses.map((c) => c.title)} />
        <Contact />
      </main>
      <SiteFooter />
      <WhatsAppFab />
      <AdminFab />
      <BackToTop />
    </>
  );
}
