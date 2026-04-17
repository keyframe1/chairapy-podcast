type PlatformButtonProps = {
  platform: "spotify" | "apple" | "amazon" | "youtube";
  href: string | null;
  disabled?: boolean;
  size?: "default" | "large";
  className?: string;
};

const PLATFORM_LABELS: Record<PlatformButtonProps["platform"], string> = {
  spotify: "Spotify",
  apple: "Apple Podcasts",
  amazon: "Amazon Music",
  youtube: "YouTube",
};

export default function PlatformButton({
  platform,
  href,
  disabled = false,
  size = "default",
  className = "",
}: PlatformButtonProps) {
  const label = PLATFORM_LABELS[platform];
  const isValid =
    !disabled &&
    typeof href === "string" &&
    (href.startsWith("http://") || href.startsWith("https://"));

  const sizeClass =
    size === "large"
      ? "px-6 py-4 text-base"
      : "px-5 py-3 text-sm";

  const base = `inline-flex w-full items-center justify-between rounded-md border ${sizeClass} transition-colors`;

  if (!isValid) {
    return (
      <span
        aria-disabled="true"
        className={`${base} border-border bg-bg-elevated text-fg-muted opacity-60 cursor-not-allowed ${className}`}
      >
        <span className="font-medium">{label}</span>
        <span className="text-xs uppercase tracking-wider">Coming soon</span>
      </span>
    );
  }

  return (
    <a
      href={href!}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} border-border bg-bg-elevated text-fg hover:border-accent hover:text-accent ${className}`}
    >
      <span className="font-medium">{label}</span>
      <span aria-hidden="true" className="text-accent">
        →
      </span>
    </a>
  );
}
