/**
 * Full-width terracotta pattern strip — "finish line" marker. Appears once per
 * page, immediately above the footer. Consistency across pages is the point.
 */
export default function TerraFooterStrip() {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="w-full"
      style={{
        height: "72px",
        backgroundImage: "url(/images/brand/pattern-terra.png)",
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 72px",
        backgroundPosition: "center",
      }}
    />
  );
}
