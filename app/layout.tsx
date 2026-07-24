import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./mobile.css";
import "@/styles/mobile/responsive.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets content extend into the iPhone notch/home-bar areas, which the
  // safe-area rules in mobile.css then account for.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  category: "education",
  title: {
    default: "Navya Computech — Master the Tech Skills of Tomorrow",
    template: "%s | Navya Computech",
  },
  description:
    "ISO 9001:2015 certified computer training institute. Learn Web Development, Digital Marketing, AI & Prompt Engineering, Tally & GST and more with 100% practical labs and placement support.",
  keywords: [
    "computer training institute",
    "computer classes",
    "RSCIT course",
    "web development course",
    "digital marketing course",
    "AI prompt engineering",
    "Tally GST course",
    "govt exam computer preparation",
    "Navya Computech",
  ],
  openGraph: {
    title: "Navya Computech — Master the Tech Skills of Tomorrow",
    description:
      "Industry-recognized courses with 100% practical labs, expert corporate trainers and placement support.",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Navya Computech — Master the Tech Skills of Tomorrow",
    description:
      "Industry-recognized courses with 100% practical labs, expert corporate trainers and placement support.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { RouteTransitionProvider } from "@/components/route-transition-provider";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <RouteTransitionProvider>
            {children}
          </RouteTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
