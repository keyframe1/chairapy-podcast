import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// 180×180 apple-touch-icon — the neon smiley on the dark backplate. Next
// auto-injects <link rel="apple-touch-icon"> from this route. The smiley is an
// inline SVG data URI; encodeURIComponent makes it a valid URL for Satori.
const smileySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="150" height="150">
  <circle cx="16" cy="16" r="12" fill="#39FF14"/>
  <ellipse cx="11.7" cy="12.8" rx="1.5" ry="2.8" fill="#0A0612"/>
  <ellipse cx="20.3" cy="12.8" rx="1.5" ry="2.8" fill="#0A0612"/>
  <path d="M9 17.5 Q16 25 23 17.5" fill="none" stroke="#0A0612" stroke-width="2.6" stroke-linecap="round"/>
</svg>`;

const smileyDataUri = `data:image/svg+xml,${encodeURIComponent(smileySvg)}`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0612",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={150} height={150} alt="" src={smileyDataUri} />
      </div>
    ),
    { ...size },
  );
}
