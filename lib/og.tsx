import type { ReactElement } from "react";

/* =====================================================================
 * Shared building blocks for the generated share images (OG / Story /
 * Square). Everything here mirrors the live hero in styles/globals.css so
 * a shared card reads like a frame lifted from the site, not a generic
 * preview: same palette, same neon glow language, same accents — and, via
 * loadOgFonts(), the same brand fonts.
 * ===================================================================== */

/* Brand palette — mirrors the :root tokens in styles/globals.css. */
export const COLORS = {
  base: "#0A0612", // --bg-black
  bgDark: "#14091F", // --bg-dark
  acid: "#39FF14", // --acid-green
  purple: "#8B2FE6", // --electric-purple
  violet: "#4A1A8C", // --deep-violet
  cyan: "#00E5FF", // --cyan
  magenta: "#FF2D95", // --hot-magenta
  textBright: "#F5F0FF", // --text-bright
  textMuted: "#A98FD0", // --text-muted
} as const;

/* ---- Fonts -------------------------------------------------------------
 * next/og (Satori) cannot read fonts from CSS — it needs the raw font data
 * as ArrayBuffers. We ship the real brand TTFs in public/fonts and load
 * them as bundled assets via `new URL(..., import.meta.url)`. That resolves
 * to a local file both at build time (so statically-generated cards work)
 * and on the edge at runtime — no dependency on the live site URL, which
 * may not exist yet on a first deploy.
 *
 * Satori cannot read woff2, so the display face ships as Clash Display's Bold
 * OTF (its heaviest cut, weight 700) — the same family the site renders, so the
 * cards match the live masthead. */
type OgFonts = { display: ArrayBuffer; mono: ArrayBuffer };

let fontCache: OgFonts | null = null;

export async function loadOgFonts(): Promise<OgFonts> {
  if (fontCache) return fontCache;
  const [display, mono] = await Promise.all([
    fetch(
      new URL("../public/fonts/ClashDisplay-Bold.otf", import.meta.url),
    ).then((r) => r.arrayBuffer()),
    fetch(
      new URL("../public/fonts/SpaceMono-Regular.ttf", import.meta.url),
    ).then((r) => r.arrayBuffer()),
  ]);
  fontCache = { display, mono };
  return fontCache;
}

export function ogFontConfig(fonts: OgFonts) {
  return [
    {
      name: "Clash Display",
      data: fonts.display,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Space Mono",
      data: fonts.mono,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

/* ---- Hero gradient mesh, rebuilt as a static frame ---------------------
 * The live hero (.hero-substrate in globals.css) layers blurred neon colour
 * pools. Satori has no blur filter, so the soft look comes from radial
 * gradients with wide transparent falloffs — the same trick the existing
 * cards use. Positions are fractions of the canvas, so every aspect ratio
 * (1.91:1, 1:1, 9:16) reads with the identical treatment. */
export function HeroBackdrop({
  width,
  height,
}: {
  width: number;
  height: number;
}): ReactElement {
  const maxDim = Math.max(width, height);

  const pool = (
    cx: number,
    cy: number,
    size: number,
    color: string,
    stop = 68,
  ) => {
    const d = maxDim * size;
    return {
      position: "absolute" as const,
      display: "flex" as const,
      left: width * cx - d / 2,
      top: height * cy - d / 2,
      width: d,
      height: d,
      background: `radial-gradient(circle, ${color}, transparent ${stop}%)`,
    };
  };

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        inset: 0,
        background: `linear-gradient(180deg, ${COLORS.bgDark} 0%, ${COLORS.base} 100%)`,
      }}
    >
      {/* Top purple wash — the substrate's overhead glow */}
      <div style={pool(0.5, 0.0, 1.05, "rgba(139,47,230,0.30)", 62)} />
      {/* Electric-purple pool, upper-left */}
      <div style={pool(0.24, 0.28, 0.62, "rgba(139,47,230,0.48)", 66)} />
      {/* Cyan glitch pool, upper-right */}
      <div style={pool(0.8, 0.18, 0.5, "rgba(0,229,255,0.26)", 66)} />
      {/* Hot-magenta pool, lower-right */}
      <div style={pool(0.7, 0.82, 0.55, "rgba(255,45,149,0.24)", 66)} />
      {/* Deep-violet pool, lower-left */}
      <div style={pool(0.22, 0.84, 0.72, "rgba(74,26,140,0.52)", 70)} />
      {/* Faint acid-green wash, centre */}
      <div style={pool(0.52, 0.5, 0.72, "rgba(57,255,20,0.09)", 70)} />
    </div>
  );
}

/* ---- Accents ----------------------------------------------------------- */

/* Equalizer bars — the div-based "audio" mark used across the site. */
export function EqualizerBars({
  heights,
  color = COLORS.acid,
  barWidth = 8,
  gap = 6,
  radius = 3,
}: {
  heights: number[];
  color?: string;
  barWidth?: number;
  gap?: number;
  radius?: number;
}): ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap }}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            width: barWidth,
            height: h,
            borderRadius: radius,
            background: color,
          }}
        />
      ))}
    </div>
  );
}

/* Waveform squiggle — the "mWv" mark from the show artwork. Rendered as a
 * data-URI SVG background so Satori draws it reliably (matches the points in
 * components/podcast/Waveform.tsx). */
export function WaveformAccent({
  color = COLORS.acid,
  width = 240,
  height = 64,
  strokeWidth = 4,
}: {
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}): ReactElement {
  const points =
    "0,15 10,5 20,25 30,8 40,22 50,15 60,5 70,25 80,10 90,20 100,15";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30' fill='none'><polyline points='${points}' stroke='${color}' stroke-width='${strokeWidth}' stroke-linecap='round' stroke-linejoin='round'/></svg>`;
  const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return (
    <div
      style={{
        display: "flex",
        width,
        height,
        backgroundImage: `url("${uri}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    />
  );
}

/* Shared text-shadow recipes for the neon glow language. */
export const GLOW = {
  title: "0 0 40px rgba(245,240,255,0.32), 0 0 90px rgba(139,47,230,0.45)",
  acid: "0 0 18px rgba(57,255,20,0.55)",
  lavender: "0 0 16px rgba(169,143,208,0.4)",
} as const;
