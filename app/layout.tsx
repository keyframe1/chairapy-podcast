import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollReveal from "../components/layout/ScrollReveal";
import VhsOverlay from "../components/brand/VhsOverlay";
import ClientErrorReporter from "../components/system/ClientErrorReporter";
import { SITE_URL } from "../lib/site";

// Display / wordmark / headings — Clash Display (Fontshare), self-hosted as a
// single variable woff2 (200–700). A distinctive neo-grotesque display face;
// nothing a default scaffold reaches for, so the site reads as designed.
const clashDisplay = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  weight: "200 700",
  variable: "--font-display",
  display: "swap",
  fallback: ["Archivo", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

// Body / UI — General Sans (Fontshare), self-hosted. Two variable cuts: the
// upright carries the UI, the italic carries the editorial "voice" (true
// italics, not synthesized) used across the show's reflective copy.
const generalSans = localFont({
  src: [
    {
      path: "./fonts/GeneralSans-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
    {
      path: "./fonts/GeneralSans-VariableItalic.woff2",
      weight: "200 700",
      style: "italic",
    },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  adjustFontFallback: "Arial",
});

// Monospace for technical/glitchy accent labels (EPISODE 15, dates, the
// "Recorded in Metairie" credit) — leans into the analog-tape character.
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
      className={`${clashDisplay.variable} ${generalSans.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-fg">
        <ClientErrorReporter />
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
        <VhsOverlay />
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
