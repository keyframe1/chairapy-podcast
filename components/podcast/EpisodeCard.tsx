import Link from "next/link";
import Image from "next/image";
import type { Episode } from "../../lib/types";
import { formatPublishedDate } from "../../lib/episodes";
import { formatDurationLabel } from "../../lib/duration";
import ListenedIndicator from "./ListenedIndicator";
import EpisodeBackplate from "./EpisodeBackplate";

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
  const duration = formatDurationLabel(episode.duration);
  const hasRealThumb = Boolean(episode.thumbnailUrl);
  const showArt = !isCompact;
  // When there's no real thumb we render the backplate with the title overlaid —
  // the card body below then skips the title to avoid duplication.
  const titleOnArt = showArt && !hasRealThumb;

  return (
    <Link
      href={`/episodes/${episode.slug}`}
      className={`group block border border-border bg-bg-elevated transition-colors hover:bg-bg hover:border-accent ${
        isFeature ? "md:grid md:grid-cols-[4fr_6fr] md:items-stretch" : ""
      }`}
      style={{ borderRadius: 4 }}
    >
      {showArt && (
        <div
          className={`relative bg-bg aspect-square overflow-hidden ${
            isFeature ? "" : ""
          }`}
        >
          {hasRealThumb ? (
            <Image
              src={episode.thumbnailUrl!}
              alt={`${episode.title} — episode artwork`}
              fill
              sizes={
                isFeature
                  ? "(max-width: 768px) 100vw, 480px"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className="object-cover"
            />
          ) : (
            <EpisodeBackplate
              title={episode.title}
              variant={isFeature ? "feature" : "card"}
            />
          )}
        </div>
      )}

      <div
        className={`${
          isFeature ? "p-8 md:p-12" : isCompact ? "p-5" : "p-6"
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="eyebrow eyebrow--accent tabular">
            Ep {episode.episodeNumber}
          </span>
          {published && (
            <>
              <span aria-hidden="true" className="text-border">·</span>
              <span className="eyebrow tabular">{published}</span>
            </>
          )}
          {duration && (
            <>
              <span aria-hidden="true" className="text-border">·</span>
              <span className="eyebrow tabular">{duration}</span>
            </>
          )}
          <ListenedIndicator slug={episode.slug} />
        </div>

        {!titleOnArt && (
          <h3
            className={`mt-3 font-display text-fg group-hover:text-accent transition-colors ${
              isFeature
                ? "text-4xl md:text-5xl"
                : isCompact
                  ? "text-xl"
                  : "text-2xl"
            }`}
            style={{ lineHeight: 1.05 }}
          >
            {episode.title}
          </h3>
        )}

        {episode.guestName && (
          <p
            className={`${
              titleOnArt ? "mt-3" : "mt-2"
            } text-base font-serif-body italic text-fg-muted`}
          >
            with {episode.guestName}
          </p>
        )}

        {!isCompact && (
          <p
            className={`mt-5 text-fg-muted ${
              isFeature ? "text-lg max-w-content" : "text-sm"
            }`}
            style={{ lineHeight: 1.55 }}
          >
            {episode.description}
          </p>
        )}

        <div className="mt-7 inline-flex items-center gap-2 text-sm text-accent editorial-link">
          <span aria-hidden="true">▶</span>
          <span className="underline underline-offset-4 group-hover:[text-underline-offset:8px] transition-all">
            {isCompact ? "Open" : isFeature ? "Listen now" : "Listen"}
          </span>
        </div>
      </div>
    </Link>
  );
}
