type SectionDividerProps = {
  className?: string;
  maxWidth?: number;
};

/**
 * Decorative divider — a glowing neon hairline with a centered acid-green
 * node. Reserved for genuine section shifts; punctuation-scale, not
 * announcement-scale.
 */
export default function SectionDivider({
  className = "",
  maxWidth = 140,
}: SectionDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`asterism-divider flex items-center justify-center gap-3 my-16 md:my-20 ${className}`}
    >
      <span
        className="h-px flex-1"
        style={{
          maxWidth: `${maxWidth}px`,
          background:
            "linear-gradient(to right, transparent, rgba(139,47,230,0.6))",
        }}
      />
      <span
        className="block h-1.5 w-1.5 rounded-full"
        style={{
          background: "var(--acid-green)",
          boxShadow: "var(--glow-green)",
        }}
      />
      <span
        className="h-px flex-1"
        style={{
          maxWidth: `${maxWidth}px`,
          background:
            "linear-gradient(to left, transparent, rgba(139,47,230,0.6))",
        }}
      />
    </div>
  );
}
