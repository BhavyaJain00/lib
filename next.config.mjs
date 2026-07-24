/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ship the committed course catalogue inside every serverless function so
  // the live site serves the real courses (lib/db.ts reads it at runtime;
  // deployed filesystems are read-only, so the file can't be created there).
  outputFileTracingIncludes: {
    "/*": ["./data/courses.json", "./data/posters.json"],
    "/**": ["./data/courses.json", "./data/posters.json"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "suxkenhqynqriduqvmgj.supabase.co" },
    ],
  },
  experimental: {
    serverActions: {
      // Course image/document uploads go through a server action; the
      // default limit is 1 MB, far below the 4/8 MB the form allows.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
