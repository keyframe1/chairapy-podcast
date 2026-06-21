/**
 * Site-wide fried-VHS texture. A fixed, pointer-events-none layer that bakes a
 * faint, STATIC tape-noise over the whole viewport — no video, no animation.
 * The moving grain now lives only in the hero (components/brand/SizzleHero),
 * where motion is expected; off the hero we want a CRT sheen you sense but do
 * not notice. Mounted once in the root layout, after the page content. Tune (or
 * disable) it with --vhs-texture-opacity in styles/globals.css (.vhs-overlay).
 */
export default function VhsOverlay() {
  return (
    <div className="vhs-overlay" aria-hidden="true">
      <div className="vhs-overlay__texture" />
    </div>
  );
}
