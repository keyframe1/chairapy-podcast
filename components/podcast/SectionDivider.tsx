import Image from "next/image";

type SectionDividerProps = {
  className?: string;
  maxWidth?: number;
};

/**
 * Decorative asterism divider — three terracotta diamonds with dot separators.
 * Use between genuine section shifts, not between every block.
 */
export default function SectionDivider({
  className = "",
  maxWidth = 180,
}: SectionDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`flex justify-center my-14 md:my-20 ${className}`}
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
