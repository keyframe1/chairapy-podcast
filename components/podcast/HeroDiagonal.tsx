import { ReactNode } from "react";

type HeroDiagonalProps = {
  children: ReactNode;
  /** Viewport height. "full" = ~70vh, "compact" = ~50vh */
  scale?: "full" | "compact";
  className?: string;
};

/**
 * Page hero built on the substrate layering model — the diagonal image is
 * used as a multiply-blended, desaturated substrate, not a photo. A
 * diagonal terracotta-to-transparent gradient (via ::after on the
 * substrate) reinforces the composition without relying on the image's
 * hard edges.
 *
 * Mobile shifts the background-position so mostly cream is visible with
 * just a hint of terracotta at the side.
 */
export default function HeroDiagonal({
  children,
  scale = "full",
  className = "",
}: HeroDiagonalProps) {
  const minHeight =
    scale === "full"
      ? "min-h-[62vh] md:min-h-[70vh]"
      : "min-h-[46vh] md:min-h-[52vh]";

  return (
    <section
      className={`page-hero w-full ${minHeight} ${className}`}
    >
      <div className="hero-substrate" aria-hidden="true" />
      <div className="relative z-10 h-full w-full">{children}</div>
    </section>
  );
}
