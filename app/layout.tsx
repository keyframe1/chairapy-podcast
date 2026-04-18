import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter, Newsreader } from "next/font/google";
import "../styles/globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FleuronOrnament from "../components/podcast/FleuronOrnament";
import { SITE_URL } from "../lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif-body",
  style: ["normal", "italic"],
  display: "swap",
});

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Eric's ADHD Experience — A Chairapy Media podcast",
    template: "%s · Eric's ADHD Experience",
  },
  description:
    "Long-form conversations with paramedics, musicians, fighters, and working people. Hosted by Eric Falgout. Recorded in New Orleans.",
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
      "Long-form conversations with paramedics, musicians, fighters, and working people.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eric's ADHD Experience — A Chairapy Media podcast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric's ADHD Experience",
    description: "Long-form conversations, recorded in New Orleans.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#C17144",
  colorScheme: "light" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${newsreader.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-fg">
        <div className="atmosphere-base" aria-hidden="true" />
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
        <div className="pt-20 md:pt-28 pb-8 md:pb-10">
          <FleuronOrnament maxWidth={180} />
        </div>
        <Footer />
        {plausibleDomain && (
          <Script
            strategy="afterInteractive"
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  );
}
