import type { CSSProperties, ComponentType } from "react";
import {
  SiSpotify,
  SiApplepodcasts,
  SiYoutube,
  SiInstagram,
  SiTiktok,
  SiFacebook,
} from "react-icons/si";

type Platform =
  | "spotify"
  | "apple"
  | "amazon"
  | "youtube"
  | "instagram"
  | "tiktok"
  | "facebook";

type PlatformButtonProps = {
  platform: Platform;
  href: string | null;
  disabled?: boolean;
  size?: "default" | "large" | "sm";
  className?: string;
};

type IconProps = { size?: number; color?: string; className?: string; style?: CSSProperties };

/**
 * Fallback music-note icon used where react-icons doesn't ship a brand
 * (Amazon removed their icons from Simple Icons upstream). Paired with the
 * Amazon Music brand color, users still get the platform signal.
 */
function AmazonMusicIcon({ size = 20, color = "currentColor", ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
      {...rest}
    >
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6zm9.14 16.6c-.27.2-.55.38-.84.54-2.31 1.26-5.14 1.93-7.83 1.93-3.8 0-7.23-1.4-9.83-3.74-.2-.18-.02-.43.22-.29 2.78 1.6 6.2 2.56 9.74 2.56 2.35 0 4.93-.49 7.3-1.5.36-.16.67.23.24.5zm1.13-1.29c-.27-.35-1.8-.17-2.5-.08-.2.02-.24-.17-.04-.3 1.22-.85 3.23-.6 3.45-.32.24.3-.08 2.3-1.2 3.26-.18.15-.35.07-.27-.12.27-.63.89-2.08.56-2.44z" />
    </svg>
  );
}

type Brand = {
  label: string;
  color: string;
  Icon: ComponentType<IconProps>;
};

const BRANDS: Record<Platform, Brand> = {
  spotify: { label: "Spotify", color: "#1DB954", Icon: SiSpotify as ComponentType<IconProps> },
  apple: { label: "Apple Podcasts", color: "#9933CC", Icon: SiApplepodcasts as ComponentType<IconProps> },
  amazon: { label: "Amazon Music", color: "#46C3D6", Icon: AmazonMusicIcon },
  youtube: { label: "YouTube", color: "#FF0000", Icon: SiYoutube as ComponentType<IconProps> },
  instagram: { label: "Instagram", color: "#E4405F", Icon: SiInstagram as ComponentType<IconProps> },
  tiktok: { label: "TikTok", color: "#010101", Icon: SiTiktok as ComponentType<IconProps> },
  facebook: { label: "Facebook", color: "#0866FF", Icon: SiFacebook as ComponentType<IconProps> },
};

function isHttp(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

export default function PlatformButton({
  platform,
  href,
  disabled = false,
  size = "default",
  className = "",
}: PlatformButtonProps) {
  const brand = BRANDS[platform];
  const Icon = brand.Icon;
  const linkable = !disabled && isHttp(href);

  const sizeClass = size === "sm" ? "platform-button--sm" : "";
  const iconSize = size === "sm" ? 16 : size === "large" ? 22 : 20;

  const style = {
    ["--platform-color" as string]: brand.color,
  } as CSSProperties;

  const body = (
    <>
      <Icon
        className="platform-icon"
        size={iconSize}
        color={linkable ? brand.color : "var(--color-fg-muted)"}
      />
      <span className="flex-1 font-serif-body italic text-left">
        {brand.label}
      </span>
      {linkable ? (
        <span aria-hidden="true" className="platform-button-arrow">
          →
        </span>
      ) : (
        <span className="platform-label--coming-soon">Coming soon</span>
      )}
    </>
  );

  if (!linkable) {
    return (
      <span
        aria-disabled="true"
        className={`platform-button platform-button--disabled ${sizeClass} ${className}`}
        style={style}
      >
        {body}
      </span>
    );
  }

  return (
    <a
      href={href!}
      target="_blank"
      rel="noopener noreferrer"
      className={`platform-button ${sizeClass} ${className}`}
      style={style}
    >
      {body}
    </a>
  );
}
