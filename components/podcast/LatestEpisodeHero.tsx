import Link from "next/link";
import Image from "next/image";
import type { Episode } from "../../lib/types";
import { formatPublishedDate } from "../../lib/episodes";
import { formatDurationLabel } from "../../lib/duration";
import EpisodeBackplate from "./EpisodeBackplate";
import ListenedIndicator from "./ListenedIndicator";

type LatestEpisodeHeroProps = {
  episode: Episode;
  /** Anchor id to link to from the "See all episodes below" CTA */
  seeAllAnchor?: string;
};

export default function LatestEpisodeHero({
  episode,
  seeAllAnchor = "recent",
}: LatestEpisodeHeroProps) {
  const published = formatPublishedDate(episode.publishedDate);
  const duration = formatDurationLabel(episode.duration);
  const href = `/episodes/${episode.slug}`;

  return (
    <article className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 md:gap-14 items-start">
      <Link
        href={href}
        aria-label={`Listen to episode ${episode.episodeNumber}: ${episode.title}`}
        className="group relative aspect-square block overflow-hidden bg-bg-elevated"
        style={{
          boxShadow: "0 20px 60px rgba(193, 113, 68, 0.18)",
          borderRadius: 4,
        }}
      >
        {episode.thumbnailUrl ? (
          <Image
            src={episode.thumbnailUrl}
            alt={`${episode.title} — episode artwork`}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <EpisodeBackplate
            title={episode.title}
            variant="feature"
            priority
          />
        )}
      </Link>

      <div className="md:pt-6">
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

        <Link href={href} className="block">
          <h2
            className="mt-5 font-display text-fg hover:text-accent transition-colors"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {episode.title}
          </h2>
        </Link>

        {episode.guestName && (
          <p className="mt-3 text-lg font-serif-body italic text-fg-muted">
            with {episode.guestName}
          </p>
        )}

        <p
          className="mt-6 font-serif-body text-lg text-fg max-w-content"
          style={{ lineHeight: 1.6 }}
        >
          {episode.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href={href}
            className="group inline-flex items-center gap-3 text-accent editorial-link"
          >
            <span aria-hidden="true" className="text-xl">
              ▶
            </span>
            <span className="text-lg underline underline-offset-4 group-hover:[text-underline-offset:8px] transition-all">
              Listen now
            </span>
          </Link>
          <a
            href={`#${seeAllAnchor}`}
            className="text-sm text-fg-muted hover:text-accent transition-colors"
          >
            See all episodes below →
          </a>
        </div>
      </div>
    </article>
  );
}
