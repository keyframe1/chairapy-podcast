"use client";

import { useEpisodeShare } from "../../lib/useEpisodeShare";

type Props = {
  slug: string;
  title: string;
  episodeNumber: number;
};

/**
 * Inline share row that sits right below the player — the highest-intent
 * moment, just after someone has listened. Compact link / story / feed
 * buttons reusing the shared episode-share behavior.
 */
export default function ShareNudge({ slug, title, episodeNumber }: Props) {
  const { copied, busy, shareLink, shareImage } = useEpisodeShare({
    slug,
    title,
    episodeNumber,
  });

  return (
    <div className="share-nudge">
      <span className="share-nudge__label">
        Liked this one? <span className="share-nudge__accent">Share it</span>
      </span>
      <div className="share-nudge__actions">
        <button type="button" className="share-nudge__btn" onClick={shareLink}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        <button
          type="button"
          className="share-nudge__btn"
          onClick={() => shareImage("story")}
          disabled={busy === "story"}
        >
          Story
        </button>
        <button
          type="button"
          className="share-nudge__btn"
          onClick={() => shareImage("square")}
          disabled={busy === "square"}
        >
          Post
        </button>
      </div>
    </div>
  );
}
