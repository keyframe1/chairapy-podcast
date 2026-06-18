import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollReveal from "../components/layout/ScrollReveal";
import { SITE_URL } from "../lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Loud, slightly condensed geometric sans for display — matches the show's
// kinetic, electric energy where the old serif read as calm/editorial.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
});

// Monospace for technical/glitchy accent labels (EPISODE 15, dates).
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Eric's ADHD Experience, a Chairapy Media podcast",
    template: "%s · Eric's ADHD Experience",
  },
  description:
    "Long conversations with people who've lived something worth talking about. Hosted by Eric Falgout, recorded in Metairie, Louisiana.",
  keywords: [
    "podcast",
    "new orleans",
    "metairie",
    "long-form",
    "recovery",
    "eric falgout",
    "chairapy",
  ],
  authors: [{ name: "Eric Falgout" }],
  openGraph: {
    type: "website",
    siteName: "Eric's ADHD Experience",
    title: "Eric's ADHD Experience",
    description:
      "Long conversations with people who've lived something worth talking about.",
    url: SITE_URL,
    // og:image is supplied by app/opengraph-image.tsx (dynamic neon card).
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric's ADHD Experience",
    description: "Long conversations, recorded in Metairie, Louisiana.",
    // twitter:image resolves from the same opengraph-image route.
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport = {
  themeColor: "#0A0612",
  colorScheme: "dark" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-fg">
        <div className="atmosphere-base" aria-hidden="true" />
        <ScrollReveal />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:outline-none"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 page-fade">
          {children}
        </main>
        <Footer />
        {plausibleDomain && (
          <Script
            strategy="afterInteractive"
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
