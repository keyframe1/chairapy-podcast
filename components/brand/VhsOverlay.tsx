/**
 * Site-wide fried-VHS texture. A fixed, pointer-events-none layer that bakes
 * faint CRT scanlines (always on) and a moving static-grain video (desktop /
 * motion-OK only) over the entire viewport. Mounted once in the root layout,
 * after the page content. Kept subtle so it reads as tape character, never as
 * interference — see the opacity tuning in styles/globals.css (.vhs-overlay).
 */
export default function VhsOverlay() {
  return (
    <div className="vhs-overlay" aria-hidden="true">
      <div className="vhs-overlay__scanlines" />
      <video
        className="vhs-overlay__grain"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/brand/vhs-grain.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
