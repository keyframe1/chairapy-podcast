type PromoPlayerProps = {
  /** Path under /public, without extension, e.g. "/brand/promo-halloween". */
  src: string;
  poster: string;
  /** Visible label above the player. */
  label?: string;
  className?: string;
};

/**
 * A single vertical (9:16) promo reel — neon-framed inline player with native
 * controls. Lazy by design: poster paints, the clip only fetches metadata
 * until the viewer taps play (preload="metadata"). Reusable on an episode page
 * or inside the homepage WatchStrip.
 */
export default function PromoPlayer({
  src,
  poster,
  label,
  className = "",
}: PromoPlayerProps) {
  return (
    <figure className={`promo-player ${className}`}>
      {label && <figcaption className="promo-player__label">{label}</figcaption>}
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster}
        width={720}
        height={1280}
      >
        <source src={`${src}.mp4`} type="video/mp4" />
        Your browser doesn&apos;t support embedded video.
      </video>
    </figure>
  );
}
