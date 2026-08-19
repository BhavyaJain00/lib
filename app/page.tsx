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
import { PostersSlider } from "@/components/sections/posters-slider";
import { SiteFooter } from "@/components/site-footer";
import { Chatbot } from "@/components/chatbot/chatbot";
import { LazyHomeFabs } from "@/components/lazy-home-fabs";
import { OrganizationJsonLd, FaqJsonLd } from "@/components/json-ld";
import { getPublicCourses, getPublicPosters } from "@/lib/db";

// Revalidate static cache every 60 seconds (ISR) for instant TTFB & fast loads.
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [courses, posters] = await Promise.all([
    getPublicCourses(),
    getPublicPosters(),
  ]);

  return (
    <>
      <OrganizationJsonLd />
      <FaqJsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <PostersSlider posters={posters} />
        <Courses />
        <WhyUs />
        <Faq />
        <Admissions />
        <Inquiry courseTitles={courses.map((c) => c.title)} />
        <Contact />
      </main>
      <SiteFooter />
      <LazyHomeFabs />
      <Chatbot />
    </>
  );
}
