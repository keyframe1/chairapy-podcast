"use client";

import { useEpisodeShare } from "../../lib/useEpisodeShare";

type Props = {
  slug: string;
  title: string;
  episodeNumber: number;
};

/**
 * Small share icon for episode cards. Sits in the card corner (revealed on
 * hover on desktop, always visible on mobile) and fires the native share /
 * clipboard copy for that episode directly — no need to open it first. It
 * renders as a sibling of the card link (not a child) so it never nests a
 * button inside an anchor.
 */
export default function CardShareButton({ slug, title, episodeNumber }: Props) {
  const { copied, shareLink } = useEpisodeShare({ slug, title, episodeNumber });

  return (
    <button
      type="button"
      className="card-share"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        shareLink();
      }}
      aria-label={`Share "${title}"`}
      title="Share episode"
    >
      {copied ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
    </button>
  );
}
