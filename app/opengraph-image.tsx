import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eric's ADHD Experience — A Chairapy Media podcast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&display=swap",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    ).then((r) => r.text());
    const match = css.match(/src: url\((https:[^)]+\.woff2)\)/);
    if (!match) return null;
    const font = await fetch(match[1]).then((r) => r.arrayBuffer());
    return font;
  } catch {
    return null;
  }
}

export default async function Image() {
  const frauncesData = await loadFraunces();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#F5F0E8",
          color: "#1A1613",
          padding: "80px 100px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 16,
            backgroundColor: "#C17144",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 28,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6B5E4B",
            }}
          >
            A Chairapy Media podcast
          </div>

          <div
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 128,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#1A1613",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Eric's ADHD</span>
            <span style={{ color: "#C17144" }}>Experience</span>
          </div>

          <div
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 28,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B5E4B",
            }}
          >
            Conversation podcast · Metairie, LA
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: frauncesData
        ? [
            {
              name: "Fraunces",
              data: frauncesData,
              style: "normal",
              weight: 500,
            },
          ]
        : undefined,
    },
  );
}
