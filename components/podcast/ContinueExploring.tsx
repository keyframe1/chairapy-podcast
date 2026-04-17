"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Episode } from "../../lib/types";
import { getListenedSlugs } from "../../lib/listening-progress";
import { formatPublishedDate } from "../../lib/episodes";

type ContinueExploringProps = {
  episodes: Episode[];
};

export default function ContinueExploring({ episodes }: ContinueExploringProps) {
  const [suggestions, setSuggestions] = useState<Episode[] | null>(null);

  useEffect(() => {
    function compute() {
      const listened = new Set(getListenedSlugs());
      if (listened.size < 3) {
        setSuggestions(null);
        return;
      }
      const unheard = episodes.filter((ep) => !listened.has(ep.slug)).slice(0, 3);
      setSuggestions(unheard);
    }
    compute();
    window.addEventListener("chairapy:listened-changed", compute);
    return () =>
      window.removeEventListener("chairapy:listened-changed", compute);
  }, [episodes]);

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <section className="py-20 md:py-24 border-t border-border">
      <div className="mx-auto w-full max-w-site px-6">
        <p className="eyebrow">For you</p>
        <h2
          className="mt-3 font-display text-3xl md:text-4xl text-fg"
          style={{ lineHeight: 1.05 }}
        >
          Continue exploring.
        </h2>
        <p className="mt-3 text-fg-muted max-w-content">
          Three episodes you haven't opened yet.
        </p>

        <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((ep) => (
            <li key={ep.id}>
              <Link
                href={`/episodes/${ep.slug}`}
                className="block border border-border p-6 transition-colors hover:bg-bg-elevated"
                style={{ borderRadius: 4 }}
              >
                <span className="eyebrow eyebrow--accent tabular">
                  Ep {ep.episodeNumber}
                </span>
                <h3
                  className="mt-2 font-display text-xl text-fg"
                  style={{ lineHeight: 1.1 }}
                >
                  {ep.title}
                </h3>
                {ep.guestName && (
                  <p className="mt-1 text-sm italic font-serif-body text-fg-muted">
                    with {ep.guestName}
                  </p>
                )}
                <p className="mt-3 text-xs text-fg-muted tabular">
                  {formatPublishedDate(ep.publishedDate)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
