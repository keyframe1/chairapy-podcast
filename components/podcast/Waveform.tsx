type WaveformProps = {
  /** Stroke colour — defaults to acid green. Pass a CSS var or hex. */
  color?: string;
  width?: number;
  height?: number;
  className?: string;
};

/**
 * The "mWv" squiggle from the show artwork, rebuilt as an animated SVG brand
 * accent. Draws itself in via stroke-dashoffset then breathes (see
 * `.waveform` in globals.css). Decorative — hidden from assistive tech.
 * Used near section headers, the Listen CTA, and in the footer.
 */
export default function Waveform({
  color = "var(--acid-green)",
  width = 60,
  height = 20,
  className = "",
}: WaveformProps) {
  return (
    <svg
      className={`waveform ${className}`}
      viewBox="0 0 100 30"
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <polyline
        points="0,15 10,5 20,25 30,8 40,22 50,15 60,5 70,25 80,10 90,20 100,15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
