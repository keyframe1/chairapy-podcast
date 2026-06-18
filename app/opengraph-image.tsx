import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eric's ADHD Experience, a Chairapy Media podcast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide default share card. Generated on the fly in the neon palette so
// every link that doesn't have its own image still previews on-brand.
export default function Image() {
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
          background:
            "linear-gradient(135deg, #0A0612 0%, #14091F 50%, #1C0F2E 100%)",
          position: "relative",
        }}
      >
        {/* Acid-green glow pool */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "12%",
            width: 340,
            height: 340,
            display: "flex",
            background:
              "radial-gradient(circle, rgba(57,255,20,0.25), transparent 70%)",
          }}
        />
        {/* Magenta glow pool */}
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            right: "10%",
            width: 360,
            height: 360,
            display: "flex",
            background:
              "radial-gradient(circle, rgba(255,45,149,0.22), transparent 70%)",
          }}
        />

        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: "#F5F0FF",
            letterSpacing: "-3px",
            display: "flex",
            textAlign: "center",
            lineHeight: 1,
            padding: "0 60px",
          }}
        >
          Eric&apos;s ADHD Experience
        </div>

        {/* Equalizer accent — acid-green bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginTop: 40, height: 44 }}>
          {[20, 38, 14, 44, 26, 40, 18].map((h, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: h,
                display: "flex",
                borderRadius: 3,
                background: "#39FF14",
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: 26,
            color: "#39FF14",
            marginTop: 28,
            fontFamily: "monospace",
            letterSpacing: "5px",
            display: "flex",
            textTransform: "uppercase",
          }}
        >
          Chairapy Media
        </div>
      </div>
    ),
    { ...size },
  );
}
