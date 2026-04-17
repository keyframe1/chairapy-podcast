type VideoPlaceholderProps = {
  caption?: string;
  className?: string;
};

export default function VideoPlaceholder({
  caption = "Coming soon",
  className = "",
}: VideoPlaceholderProps) {
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-sm border border-border ${className}`}
      style={{
        background:
          "linear-gradient(135deg, var(--color-accent) 0%, #8a4a28 45%, #1A1613 100%)",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ opacity: 0.5 }}
          fill="#F5F0E8"
        >
          <polygon points="7,5 19,12 7,19" />
        </svg>
        <span
          className="eyebrow"
          style={{ color: "#F5F0E8", opacity: 0.8 }}
        >
          {caption}
        </span>
      </div>
    </div>
  );
}
