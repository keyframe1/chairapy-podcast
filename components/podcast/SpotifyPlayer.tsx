type SpotifyPlayerProps = {
  embedUrl: string;
  compact?: boolean;
  /**
   * Defaults to true — below-the-fold embeds don't block initial paint.
   * Set `lazy={false}` for the primary player on an episode detail page
   * so it's visible immediately.
   */
  lazy?: boolean;
  /**
   * When true, drops all container chrome (border, background, rounding)
   * so the iframe sits flush on the page — editorial article style.
   */
  bare?: boolean;
};

export default function SpotifyPlayer({
  embedUrl,
  compact = false,
  lazy = true,
  bare = false,
}: SpotifyPlayerProps) {
  const container = bare
    ? "w-full overflow-hidden"
    : "w-full rounded-xl overflow-hidden border border-border bg-bg-elevated";

  return (
    <div className={container}>
      <iframe
        src={embedUrl}
        width="100%"
        height={compact ? 152 : 232}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading={lazy ? "lazy" : "eager"}
        title="Spotify podcast player"
        style={{ border: 0 }}
      />
    </div>
  );
}
