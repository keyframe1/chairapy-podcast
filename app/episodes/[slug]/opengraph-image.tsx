import { ImageResponse } from "next/og";
import { getAllEpisodes, getEpisodeBySlug } from "../../../lib/episodes";

export const runtime = "edge";
export const alt = "Eric's ADHD Experience episode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-render one share card per episode at build time.
export function generateStaticParams() {
  return getAllEpisodes().map((ep) => ({ slug: ep.slug }));
}

// Per-episode neon share card — episode title in bright white, "EPISODE N" in
// acid-green mono. Every shared episode link gets its own branded preview.
export default function Image({ params }: { params: { slug: string } }) {
  const episode = getEpisodeBySlug(params.slug);
  const title = episode?.title ?? "Eric's ADHD Experience";
  const episodeNumber = episode?.episodeNumber;

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
          background:
            "linear-gradient(135deg, #0A0612 0%, #14091F 50%, #1C0F2E 100%)",
          position: "relative",
          padding: "0 80px",
        }}
      >
        {/* Acid-green glow pool */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-6%",
            width: 420,
            height: 420,
            display: "flex",
            background:
              "radial-gradient(circle, rgba(57,255,20,0.22), transparent 70%)",
          }}
        />
        {/* Violet glow pool */}
        <div
          style={{
            position: "absolute",
            bottom: "-12%",
            left: "-8%",
            width: 460,
            height: 460,
            display: "flex",
            background:
              "radial-gradient(circle, rgba(139,47,230,0.3), transparent 70%)",
          }}
        />

        {episodeNumber != null && (
          <div
            style={{
              fontSize: 30,
              color: "#39FF14",
              fontFamily: "monospace",
              letterSpacing: "6px",
              display: "flex",
              textTransform: "uppercase",
            }}
          >
            Episode {episodeNumber}
          </div>
        )}

        <div
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            color: "#F5F0FF",
            letterSpacing: "-2px",
            lineHeight: 1.02,
            display: "flex",
            marginTop: 20,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 44,
          }}
        >
          {/* Equalizer accent */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 28 }}>
            {[14, 26, 10, 28, 18].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: h,
                  display: "flex",
                  borderRadius: 2,
                  background: "#39FF14",
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#A98FD0",
              fontFamily: "monospace",
              letterSpacing: "3px",
              display: "flex",
              textTransform: "uppercase",
            }}
          >
            Eric&apos;s ADHD Experience · Chairapy Media
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
