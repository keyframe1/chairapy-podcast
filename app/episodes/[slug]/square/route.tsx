import { ImageResponse } from "next/og";
import { getEpisodeBySlug } from "../../../../lib/episodes";
import {
  COLORS,
  GLOW,
  HeroBackdrop,
  EqualizerBars,
  WaveformAccent,
  loadOgFonts,
  ogFontConfig,
} from "../../../../lib/og";

export const runtime = "edge";

// 1:1 feed graphic (Instagram posts / carousels). Same on-demand generation
// pattern as the Story route — built per request, cached at the CDN.
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const episode = getEpisodeBySlug(params.slug);
  if (!episode) return new Response("Not found", { status: 404 });

  const fonts = await loadOgFonts();
  const width = 1080;
  const height = 1080;
  const title = episode.title;
  const titleSize =
    title.length > 40 ? 64 : title.length > 24 ? 84 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          padding: "0 92px",
          background: COLORS.base,
          fontFamily: "Space Grotesk",
        }}
      >
        <HeroBackdrop width={width} height={height} />

        {/* Episode number eyebrow */}
        <div
          style={{
            position: "relative",
            display: "flex",
            fontFamily: "Space Mono",
            fontSize: 32,
            letterSpacing: "7px",
            textTransform: "uppercase",
            color: COLORS.acid,
            textShadow: GLOW.acid,
          }}
        >
          Episode {episode.episodeNumber}
        </div>

        {/* Title — centred, balanced */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 30,
            fontSize: titleSize,
            fontWeight: 700,
            letterSpacing: "-2px",
            lineHeight: 1.0,
            color: COLORS.textBright,
            textShadow: GLOW.title,
            textAlign: "center",
          }}
        >
          {title}
        </div>

        {/* Guest line */}
        {episode.guestName && (
          <div
            style={{
              position: "relative",
              display: "flex",
              marginTop: 26,
              fontSize: 34,
              color: COLORS.textMuted,
              textShadow: GLOW.lavender,
            }}
          >
            with {episode.guestName}
          </div>
        )}

        {/* Waveform accent */}
        <div style={{ position: "relative", display: "flex", marginTop: 40 }}>
          <WaveformAccent width={280} height={64} />
        </div>

        {/* Footer brand line */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: 16,
            bottom: 64,
          }}
        >
          <EqualizerBars heights={[14, 26, 10, 28, 18]} barWidth={6} gap={5} radius={2} />
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
    {
      width,
      height,
      fonts: ogFontConfig(fonts),
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400",
      },
    },
  );
}
