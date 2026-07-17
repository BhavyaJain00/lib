import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Navya Computech — Master the Tech Skills of Tomorrow",
    template: "%s | Navya Computech",
  },
  description:
    "ISO 9001:2015 certified computer training institute. Learn Web Development, Digital Marketing, AI & Prompt Engineering, Tally & GST and more with 100% practical labs and placement support.",
  keywords: [
    "computer training institute",
    "web development course",
    "digital marketing course",
    "AI prompt engineering",
    "Tally GST course",
    "Navya Computech",
  ],
  openGraph: {
    title: "Navya Computech — Master the Tech Skills of Tomorrow",
    description:
      "Industry-recognized courses with 100% practical labs, expert corporate trainers and placement support.",
    type: "website",
  },
};

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
