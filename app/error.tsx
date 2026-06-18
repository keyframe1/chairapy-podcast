"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-24">
        <p className="eyebrow eyebrow--amber mb-4">Something went wrong</p>
        <h1 className="glitch-text font-display font-bold text-4xl sm:text-5xl mb-6">
          That didn't work.
        </h1>
        <p className="text-fg-muted max-w-md mb-10">
          The page hit a snag. Try again, or head back to the episode list.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-acid text-bg rounded-md font-bold shadow-glow-green hover:bg-accent-hover hover:shadow-glow-green-strong transition-[background-color,box-shadow]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-cyan/60 text-cyan rounded-md hover:bg-cyan/10 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </Container>
  );
}
