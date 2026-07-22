import type { Metadata } from "next";
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
import { Chatbot } from "@/components/chatbot/chatbot";
import { BackToTop } from "@/components/back-to-top";
import { OrganizationJsonLd, FaqJsonLd } from "@/components/json-ld";
import { getPublicCourses } from "@/lib/db";

// Force dynamic rendering so admin course toggles take effect immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const courses = await getPublicCourses();

  return (
    <>
      <OrganizationJsonLd />
      <FaqJsonLd />
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
      <Chatbot />
      <BackToTop />
    </>
  );
}
