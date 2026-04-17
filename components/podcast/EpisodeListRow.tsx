import Link from "next/link";
import Image from "next/image";
import type { Episode } from "../../lib/types";
import { formatPublishedDate } from "../../lib/episodes";
import { formatDurationLabel } from "../../lib/duration";
import ListenedIndicator from "./ListenedIndicator";

type EpisodeListRowProps = {
  episode: Episode;
};

export default function EpisodeListRow({ episode }: EpisodeListRowProps) {
  const published = formatPublishedDate(episode.publishedDate);
  const duration = formatDurationLabel(episode.duration);

  return (
    <Link
      href={`/episodes/${episode.slug}`}
      className="group grid grid-cols-[auto_64px_1fr_auto] items-center gap-4 md:gap-6 border-b border-border py-5 transition-colors hover:bg-bg-elevated/60"
    >
      <span className="font-mono text-sm tabular text-fg-muted w-10 text-right">
        {String(episode.episodeNumber).padStart(2, "0")}
      </span>

      <div className="relative w-16 h-16 rounded-sm overflow-hidden bg-bg-elevated border border-border flex-none">
        {episode.thumbnailUrl ? (
          <Image
            src={episode.thumbnailUrl}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[10px] text-fg-muted">
              {episode.episodeNumber}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3
            className="font-display text-xl text-fg group-hover:text-accent transition-colors truncate"
            style={{ lineHeight: 1.15 }}
          >
            {episode.title}
          </h3>
          <ListenedIndicator slug={episode.slug} />
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-fg-muted">
          {episode.guestName && (
            <span className="font-serif-body italic">
              with {episode.guestName}
            </span>
          )}
          {episode.guestName && published && (
            <span aria-hidden="true" className="text-border">·</span>
          )}
          {published && <span className="tabular">{published}</span>}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 text-sm text-fg-muted">
        {duration && <span className="tabular">{duration}</span>}
        <span
          className="text-accent opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          ▶
        </span>
      </div>
    </Link>
  );
}
