import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eric's ADHD Experience — A Chairapy Media podcast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F0D0B",
          color: "#F5F0E8",
          fontFamily: "Georgia, serif",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          Eric's ADHD Experience
        </div>
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: "#C17144",
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 28,
            color: "#A89D8D",
            fontWeight: 300,
          }}
        >
          A Chairapy Media production
        </div>
      </div>
    ),
    { ...size },
  );
}
