/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
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
