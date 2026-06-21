import { ImageResponse } from "next/og";
import { getEpisodeBySlug } from "../../../../lib/episodes";
import {
  COLORS,
  GLOW,
  HeroBackdrop,
  EqualizerBars,
  loadOgFonts,
  ogFontConfig,
} from "../../../../lib/og";

export const runtime = "edge";

// 9:16 full-screen Story graphic (Instagram / Facebook Stories). Generated
// on demand and cached at the CDN — see the Cache-Control header below.
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const episode = getEpisodeBySlug(params.slug);
  if (!episode) return new Response("Not found", { status: 404 });

  const fonts = await loadOgFonts();
  const width = 1080;
  const height = 1920;
  const title = episode.title;
  const titleSize =
    title.length > 40 ? 78 : title.length > 24 ? 98 : 118;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "96px 80px 110px",
          background: COLORS.base,
          fontFamily: "Clash Display",
        }}
      >
        <HeroBackdrop width={width} height={height} />

        {/* Top branding */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 0.95,
              color: COLORS.textBright,
              textShadow: GLOW.title,
            }}
          >
            Eric&apos;s ADHD Experience
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Space Mono",
              fontSize: 26,
              letterSpacing: "6px",
              textTransform: "uppercase",
              color: COLORS.textMuted,
            }}
          >
            A Chairapy Media Podcast
          </div>
        </div>

        {/* Flexible spacer pushes the title into the lower third */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Title block — anchored lower third */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Space Mono",
              fontSize: 34,
              letterSpacing: "6px",
              textTransform: "uppercase",
              color: COLORS.acid,
              textShadow: GLOW.acid,
            }}
          >
            Episode {episode.episodeNumber}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: titleSize,
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 0.98,
              color: COLORS.textBright,
              textShadow: GLOW.title,
            }}
          >
            {title}
          </div>
          {episode.guestName && (
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 38,
                color: COLORS.textMuted,
                textShadow: GLOW.lavender,
              }}
            >
              with {episode.guestName}
            </div>
          )}
        </div>

        {/* Listen-now bar */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 56,
          }}
        >
          <EqualizerBars heights={[20, 40, 16, 44, 26, 38]} barWidth={8} gap={6} />
          <div
            style={{
              display: "flex",
              fontFamily: "Space Mono",
              fontSize: 30,
              letterSpacing: "2px",
              color: COLORS.textBright,
            }}
          >
            Listen now at podcast.chairapy.org
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
