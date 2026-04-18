import type { ComponentType, CSSProperties } from "react";
import {
  SiSpotify,
  SiApplepodcasts,
  SiYoutube,
  SiInstagram,
  SiTiktok,
  SiFacebook,
  SiRumble,
  SiRss,
} from "react-icons/si";

type Platform =
  | "spotify"
  | "apple"
  | "amazon"
  | "youtube"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "rumble"
  | "rss";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

function AmazonMusicIcon({ size = 14, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
    >
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6zm9.14 16.6c-.27.2-.55.38-.84.54-2.31 1.26-5.14 1.93-7.83 1.93-3.8 0-7.23-1.4-9.83-3.74-.2-.18-.02-.43.22-.29 2.78 1.6 6.2 2.56 9.74 2.56 2.35 0 4.93-.49 7.3-1.5.36-.16.67.23.24.5zm1.13-1.29c-.27-.35-1.8-.17-2.5-.08-.2.02-.24-.17-.04-.3 1.22-.85 3.23-.6 3.45-.32.24.3-.08 2.3-1.2 3.26-.18.15-.35.07-.27-.12.27-.63.89-2.08.56-2.44z" />
    </svg>
  );
}

const BRANDS: Record<
  Platform,
  { label: string; color: string; Icon: ComponentType<IconProps> }
> = {
  spotify: { label: "Spotify", color: "#1DB954", Icon: SiSpotify as ComponentType<IconProps> },
  apple: { label: "Apple Podcasts", color: "#9933CC", Icon: SiApplepodcasts as ComponentType<IconProps> },
  amazon: { label: "Amazon Music", color: "#46C3D6", Icon: AmazonMusicIcon },
  youtube: { label: "YouTube", color: "#FF0000", Icon: SiYoutube as ComponentType<IconProps> },
  instagram: { label: "Instagram", color: "#E4405F", Icon: SiInstagram as ComponentType<IconProps> },
  tiktok: { label: "TikTok", color: "#010101", Icon: SiTiktok as ComponentType<IconProps> },
  facebook: { label: "Facebook", color: "#0866FF", Icon: SiFacebook as ComponentType<IconProps> },
  rumble: { label: "Rumble", color: "#85C742", Icon: SiRumble as ComponentType<IconProps> },
  rss: { label: "RSS", color: "#FF8800", Icon: SiRss as ComponentType<IconProps> },
};

function isHttp(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

type PlatformLinkProps = {
  platform: Platform;
  href: string | null | undefined;
  iconSize?: number;
};

/**
 * Minimal icon + label row. No box, no arrow. Used in the footer Listen /
 * Follow columns where the footer should quietly reference platforms, not
 * sell them. For boxed CTAs use PlatformButton.
 */
export default function PlatformLink({
  platform,
  href,
  iconSize = 14,
}: PlatformLinkProps) {
  const brand = BRANDS[platform];
  const { Icon } = brand;
  const linkable = isHttp(href);

  const common = (
    <>
      <Icon
        size={iconSize}
        color={linkable ? brand.color : "currentColor"}
      />
      <span className="text-sm">{brand.label}</span>
    </>
  );

  if (!linkable) {
    return (
      <span
        aria-disabled="true"
        className="inline-flex items-center gap-2 text-fg-muted opacity-60 cursor-not-allowed"
      >
        {common}
      </span>
    );
  }

  return (
    <a
      href={href!}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-fg hover:text-accent transition-colors group"
    >
      {common}
    </a>
  );
}
