import { ImageResponse } from "next/og";
import {
  COLORS,
  GLOW,
  HeroBackdrop,
  WaveformAccent,
  loadOgFonts,
  ogFontConfig,
} from "../lib/og";

export const runtime = "edge";
export const alt = "Eric's ADHD Experience, a Chairapy Media podcast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide default share card — a static frame of the hero masthead, in the
// real brand fonts. Every link without its own image previews on-brand.
export default async function Image() {
  const fonts = await loadOgFonts();
  const { width, height } = size;

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
          position: "relative",
          background: COLORS.base,
          fontFamily: "Clash Display",
        }}
      >
        <HeroBackdrop width={width} height={height} />

        {/* Eyebrow */}
        <div
          style={{
            position: "relative",
            display: "flex",
            fontFamily: "Space Mono",
            fontSize: 26,
            letterSpacing: "8px",
            textTransform: "uppercase",
            color: COLORS.acid,
            textShadow: GLOW.acid,
          }}
        >
          A Chairapy Media Podcast
        </div>

        {/* Masthead — the hero's stacked wordmark */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 24,
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: "-4px",
            lineHeight: 0.92,
            color: COLORS.textBright,
            textShadow: GLOW.title,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex" }}>Eric&apos;s</div>
          <div style={{ display: "flex" }}>ADHD</div>
          <div style={{ display: "flex" }}>Experience</div>
        </div>

        {/* Acid underline + waveform accent */}
        <div
          style={{
            position: "relative",
            display: "flex",
            marginTop: 28,
            height: 4,
            width: 132,
            background: COLORS.acid,
            boxShadow: "0 0 18px rgba(57,255,20,0.85)",
          }}
        />
        <div style={{ position: "relative", display: "flex", marginTop: 22 }}>
          <WaveformAccent width={300} height={70} />
        </div>

        {/* Footer URL */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: 44,
            fontFamily: "Space Mono",
            fontSize: 22,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: COLORS.textMuted,
          }}
        >
          podcast.chairapy.org
        </div>
      </div>
    ),
    {
      ...size,
      fonts: ogFontConfig(fonts),
      headers: {
        // Long CDN cache so link crawlers get a warm cached PNG, not a cold render.
        "Cache-Control":
          "public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400",
      },
    },
  );
}
