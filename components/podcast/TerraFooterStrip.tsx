/**
 * Footer signature strip. No longer a crisp opaque band — the pattern
 * dissolves into the cream at both edges via pseudo-element gradients,
 * multiply-blended and desaturated so it reads as a sign-off rather than
 * a decoration.
 */
export default function TerraFooterStrip() {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="footer-signature-strip w-full"
    >
      <div className="footer-signature-strip-inner" />
    </div>
  );
}
