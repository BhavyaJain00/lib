/**
 * Canonical site URL — used for metadata, sitemap, robots and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in .env once the site has a real domain
 * (e.g. https://navyacomputech.com). Falls back to localhost for dev.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const SITE_NAME = "Navya Computech";
