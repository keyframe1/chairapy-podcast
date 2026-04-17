import Link from "next/link";
import type { Episode } from "../../lib/types";
import { formatPublishedDate } from "../../lib/episodes";

type EpisodeCardProps = {
  episode: Episode;
  variant?: "feature" | "list" | "compact";
};

export default function EpisodeCard({
  episode,
  variant = "list",
}: EpisodeCardProps) {
  const isFeature = variant === "feature";
  const isCompact = variant === "compact";
  const published = formatPublishedDate(episode.publishedDate);

  return (
    <Link
      href={`/episodes/${episode.slug}`}
      className={`block rounded-lg border border-border bg-bg-elevated transition-colors hover:border-accent ${
        isFeature ? "p-8 md:p-10" : isCompact ? "p-5" : "p-6"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.2em] text-fg-muted">
        <span className="font-mono text-accent">Ep {episode.episodeNumber}</span>
        {published && (
          <>
            <span aria-hidden="true">·</span>
            <span>{published}</span>
          </>
        )}
        {episode.featured && isFeature && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-accent">Featured</span>
          </>
        )}
      </div>

      <h3
        className={`mt-3 font-display text-fg ${
          isFeature
            ? "text-3xl md:text-4xl"
            : isCompact
              ? "text-xl"
              : "text-2xl"
        }`}
      >
        {episode.title}
      </h3>

      {episode.guestName && (
        <p className="mt-1 text-sm text-fg-muted">With {episode.guestName}</p>
      )}

      {!isCompact && (
        <p
          className={`mt-4 text-fg-muted ${
            isFeature ? "text-base md:text-lg max-w-content" : "text-sm"
          }`}
        >
          {episode.description}
        </p>
      )}

      <div className="mt-6 inline-flex items-center gap-2 text-sm text-accent">
        <span>{isCompact ? "Open episode" : "Listen to this episode"}</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}
