type SmileyLoaderProps = {
  /** Rendered width in px (height follows the source aspect). Default 120. */
  size?: number;
  className?: string;
};

/**
 * The show's spinning green smiley — the brand's loading / accent element.
 * Replaces the equalizer-bars loader and anchors the 404. The clip carries a
 * black field that blends into the near-black site bg (no usable alpha — see
 * the brand-media pipeline note), so it reads as the mascot floating on the
 * page. Under prefers-reduced-motion the video is swapped for the static
 * mascot face (icon-180, doubling as the poster so it's a single download).
 */
export default function SmileyLoader({ size = 120, className = "" }: SmileyLoaderProps) {
  return (
    <span
      className={`smiley-loader ${className}`}
      style={{ width: size }}
      role="status"
      aria-label="Loading"
    >
      <video
        className="smiley-loader__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/brand/icon-180.png"
        aria-hidden="true"
      >
        <source src="/brand/smiley-spin.webm" type="video/webm" />
        <source src="/brand/smiley-spin.mp4" type="video/mp4" />
      </video>
      {/* Static fallback shown only under prefers-reduced-motion (CSS) */}
      <img
        className="smiley-loader__static"
        src="/brand/icon-180.png"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
      />
    </span>
  );
}
