import Image from "next/image";
import { ReactNode } from "react";

type HeroDiagonalProps = {
  children: ReactNode;
  /** Viewport height of the section. "full" = ~80vh, "compact" = ~40vh */
  scale?: "full" | "compact";
  className?: string;
};

/**
 * Full-bleed hero backdrop using the diagonal paper-collage composition.
 *
 * - Desktop: shows the full diagonal — terracotta left / cream right.
 * - Mobile: shifts to mostly cream with a hint of terracotta at the top.
 *
 * Children render on the cream (right) half. A cream-to-transparent gradient
 * guarantees type legibility without flattening the paper texture.
 */
export default function HeroDiagonal({
  children,
  scale = "full",
  className = "",
}: HeroDiagonalProps) {
  const minHeight =
    scale === "full"
      ? "min-h-[70vh] md:min-h-[78vh]"
      : "min-h-[38vh] md:min-h-[44vh]";

  return (
    <section
      className={`relative w-full ${minHeight} overflow-hidden ${className}`}
      style={{ isolation: "isolate" }}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src="/images/brand/hero-diagonal.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_50%] md:object-center"
        />
        {/* Cream scrim on the right so display type reads clean */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(245,240,232,0) 0%, rgba(245,240,232,0.35) 55%, rgba(245,240,232,0.65) 100%)",
          }}
        />
      </div>

      {children}
    </section>
  );
}
