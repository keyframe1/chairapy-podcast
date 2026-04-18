import Image from "next/image";

type FleuronOrnamentProps = {
  /** Cap width in pixels. 320 for page tops, 180 for footer. */
  maxWidth?: number;
  className?: string;
};

/**
 * Ornate fleuron. Rendered at 45% opacity with a warm sepia duotone filter
 * so the solid black source reads as deep sepia and sits in the palette.
 */
export default function FleuronOrnament({
  maxWidth = 320,
  className = "",
}: FleuronOrnamentProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`flex justify-center ${className}`}
    >
      <div
        className="relative w-full fleuron-ornament"
        style={{
          maxWidth: `${maxWidth}px`,
          aspectRatio: "6 / 1",
          opacity: 0.45,
          filter: "sepia(0.6) hue-rotate(-20deg) saturate(0.8)",
        }}
      >
        <Image
          src="/images/brand/ornamental-fleuron.png"
          alt=""
          fill
          sizes={`${maxWidth}px`}
          className="object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
}
