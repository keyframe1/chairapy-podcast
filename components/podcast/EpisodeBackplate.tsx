type EpisodeBackplateProps = {
  title: string;
  /** card = square fallback thumbnail; feature = homepage featured art area */
  variant?: "card" | "feature";
  /** Episode number or any int — used for alternating gradient rhythm */
  index?: number;
  priority?: boolean;
};

/**
 * Fallback art for episodes with no real thumbnail. Pure-CSS neon backplate
 * — a dark violet field with a drifting glow and the title overlaid — so it
 * sits naturally alongside the show's electric artwork instead of a cream
 * painterly texture.
 */
export default function EpisodeBackplate({
  title,
  variant = "card",
  index = 0,
}: EpisodeBackplateProps) {
  const isFeature = variant === "feature";
  // Alternate the glow anchor so repeated backplates read as intentional
  const glow =
    index % 2 === 0
      ? "radial-gradient(circle at 28% 26%, rgba(139,47,230,0.55), transparent 55%), radial-gradient(circle at 80% 80%, rgba(0,229,255,0.28), transparent 55%)"
      : "radial-gradient(circle at 75% 25%, rgba(255,45,149,0.4), transparent 55%), radial-gradient(circle at 25% 78%, rgba(139,47,230,0.55), transparent 55%)";

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: `${glow}, linear-gradient(160deg, var(--bg-card) 0%, var(--bg-black) 100%)`,
      }}
    >
      {/* Scanline texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,0.25) 3px)",
          opacity: 0.4,
        }}
      />
      <div
        className={`absolute inset-x-0 bottom-0 flex items-end ${
          isFeature ? "p-8 md:p-10" : "p-5"
        }`}
      >
        <h3
          className={`font-display font-bold text-left ${
            isFeature ? "text-4xl md:text-5xl" : "text-xl"
          }`}
          style={{
            color: "var(--text-bright)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            textShadow: "0 0 18px rgba(139, 47, 230, 0.7)",
          }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}
