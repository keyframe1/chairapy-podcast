import Image from "next/image";

type SectionDividerProps = {
  className?: string;
  maxWidth?: number;
};

/**
 * Decorative asterism divider. Reserved for genuine section shifts —
 * target cadence is 1 per tonal transition, max 2–3 per long page.
 * 140px max keeps it punctuation-scale rather than announcement-scale.
 */
export default function SectionDivider({
  className = "",
  maxWidth = 140,
}: SectionDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`asterism-divider flex justify-center my-16 md:my-20 ${className}`}
    >
      <div
        className="relative w-full"
        style={{ maxWidth: `${maxWidth}px`, aspectRatio: "3 / 1" }}
      >
        <Image
          src="/images/brand/divider-asterism.png"
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
