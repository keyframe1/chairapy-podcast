import Image from "next/image";

type FleuronOrnamentProps = {
  /** Cap width in pixels. 320 for page tops, 240 for footer. */
  maxWidth?: number;
  className?: string;
};

/**
 * Ornate fleuron ornament. Always rendered at 60% opacity to soften
 * its solid black down toward sepia so it sits inside the palette.
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
        className="relative w-full"
        style={{ maxWidth: `${maxWidth}px`, aspectRatio: "6 / 1", opacity: 0.6 }}
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
