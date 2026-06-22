"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SmileyLoader from "@/components/brand/SmileyLoader";
import { reportClientError } from "@/lib/report-error";

/**
 * Root error boundary. Renders a branded fallback — never the raw white
 * "Application error" screen — and reports the error (message, stack,
 * userAgent) to the `client_error` analytics event so the next occurrence is
 * logged with the exact cause and device.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error, "error-boundary:root");
  }, [error]);

  return (
    <div className="relative overflow-hidden" style={{ isolation: "isolate" }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(139,47,230,0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,45,149,0.22), transparent 50%)",
        }}
      />

      <Container width="content">
        <div className="min-h-[70vh] flex flex-col items-start justify-center py-24">
          <SmileyLoader size={132} className="mb-8" />
          <p className="eyebrow eyebrow--amber tabular">Lost the signal</p>
          <h1
            className="glitch-text mt-6 font-display font-bold text-fg"
            style={{
              fontSize: "var(--text-display)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            That didn&apos;t play.
          </h1>
          <p className="mt-6 font-serif-body italic text-xl text-fg-muted max-w-content">
            The tape jammed for a second. Give it another spin, or head back to
            the episodes.
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
    </div>
  );
}
