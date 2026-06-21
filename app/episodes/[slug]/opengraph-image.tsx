import { ImageResponse } from "next/og";
import { getAllEpisodes, getEpisodeBySlug } from "../../../lib/episodes";
import {
  COLORS,
  GLOW,
  HeroBackdrop,
  EqualizerBars,
  loadOgFonts,
  ogFontConfig,
} from "../../../lib/og";

export const runtime = "edge";
export const alt = "Eric's ADHD Experience episode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-render one share card per episode at build time.
export function generateStaticParams() {
  return getAllEpisodes().map((ep) => ({ slug: ep.slug }));
}

// Per-episode link-preview card (iMessage, Facebook, Twitter, etc.) — the
// episode title set in the real hero fonts over the hero gradient mesh.
export default async function Image({ params }: { params: { slug: string } }) {
  const episode = getEpisodeBySlug(params.slug);
  const title = episode?.title ?? "Eric's ADHD Experience";
  const episodeNumber = episode?.episodeNumber;
  const guestName = episode?.guestName ?? null;
  const fonts = await loadOgFonts();
  const { width, height } = size;

  // Scale the title down for long names so it never overflows the card.
  const titleSize = title.length > 38 ? 64 : title.length > 22 ? 80 : 96;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          padding: "0 80px",
          background: COLORS.base,
          fontFamily: "Clash Display",
        }}
      >
        <HeroBackdrop width={width} height={height} />

        {/* Episode number eyebrow */}
        <div
          style={{
            position: "relative",
            display: "flex",
            fontFamily: "Space Mono",
            fontSize: 30,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: COLORS.acid,
            textShadow: GLOW.acid,
          }}
        >
          {episodeNumber != null
            ? `Episode ${episodeNumber}`
            : "A Chairapy Media Podcast"}
        </div>

        {/* Title */}
        <div
          style={{
            position: "relative",
            display: "flex",
            marginTop: 22,
            fontSize: titleSize,
            fontWeight: 700,
            letterSpacing: "-2px",
            lineHeight: 1.0,
            color: COLORS.textBright,
            textShadow: GLOW.title,
          }}
        >
          {title}
        </div>

        {/* Guest line */}
        {guestName && (
          <div
            style={{
              position: "relative",
              display: "flex",
              marginTop: 22,
              fontSize: 30,
              color: COLORS.textMuted,
              textShadow: GLOW.lavender,
            }}
          >
            with {guestName}
          </div>
        )}

        {/* Accent row — equalizer + show line */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 44,
          }}
        >
          <EqualizerBars
            heights={[14, 26, 10, 28, 18]}
            barWidth={6}
            gap={5}
            radius={2}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "Space Mono",
              fontSize: 24,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: COLORS.textMuted,
            }}
          >
            Eric&apos;s ADHD Experience · Chairapy Media
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFontConfig(fonts) },
  );
}
