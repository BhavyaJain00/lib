import type { MetadataRoute } from "next";
import { getPublicCourses } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // The LIVE catalogue (admin-managed), so new courses are discovered and
  // hidden/deleted ones drop out — not the built-in samples.
  const courses = await getPublicCourses();
  const coursePages: MetadataRoute.Sitemap = courses.map((course) => {
    const updatedAt = (course as { updatedAt?: string }).updatedAt;
    return {
      url: `${SITE_URL}/courses/${course.slug}`,
      lastModified: updatedAt ? new Date(updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.9,
    };
  });

  return [...staticPages, ...coursePages];
}
