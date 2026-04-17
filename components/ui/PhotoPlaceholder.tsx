type PhotoPlaceholderProps = {
  label?: string;
  className?: string;
  aspect?: "square" | "portrait" | "wide";
};

export default function PhotoPlaceholder({
  label = "Photo coming soon",
  className = "",
  aspect = "square",
}: PhotoPlaceholderProps) {
  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[16/9]",
  }[aspect];

  return (
    <div
      className={`${aspectClass} w-full rounded-md bg-bg-elevated border border-border flex items-center justify-center ${className}`}
    >
      <span className="text-xs uppercase tracking-[0.2em] text-fg-muted">
        {label}
      </span>
    </div>
  );
}
