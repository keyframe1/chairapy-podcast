"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SmileyLoader from "@/components/brand/SmileyLoader";
import { reportClientError } from "@/lib/report-error";

/**
 * Episode-route error boundary. Catches anything that throws while rendering
 * an episode page so the share/listen flow degrades to a branded fallback
 * instead of the raw white "Application error" screen, and reports the cause
 * to the `client_error` analytics event.
 */
export default function EpisodeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error, "error-boundary:episode");
  }, [error]);

  return (
    <Container width="content">
      <div className="min-h-[60vh] flex flex-col items-start justify-center py-24">
        <SmileyLoader size={112} className="mb-8" />
        <p className="eyebrow eyebrow--amber tabular">Lost the signal</p>
        <h1
          className="glitch-text mt-6 font-display font-bold text-fg text-4xl sm:text-5xl"
          style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
        >
          This episode hit a snag.
        </h1>
        <p className="mt-6 font-serif-body italic text-xl text-fg-muted max-w-content">
          Something glitched while loading this one. Try again, or browse the
          rest of the archive.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 bg-acid text-bg rounded-md font-bold shadow-glow-green hover:bg-accent-hover hover:shadow-glow-green-strong transition-[background-color,box-shadow]"
          >
            Reload
          </button>
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 text-acid editorial-link"
          >
            <span className="text-lg underline underline-offset-4 hover:[text-underline-offset:8px] transition-all">
              All episodes
            </span>
          </Link>
        </div>
      </div>
    </Container>
  );
}
