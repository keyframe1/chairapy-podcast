import Link from "next/link";
import type { Guest } from "../../lib/types";

type GuestCardProps = {
  guest: Guest;
};

/**
 * Minimalist directory entry — no box, no card background. The substrate
 * carries the visual field; each guest is just a name and role in the
 * editorial voice, underlined on hover.
 */
export default function GuestCard({ guest }: GuestCardProps) {
  return (
    <Link
      href={`/guests/${guest.slug}`}
      className="group block py-2"
    >
      <h3
        className="font-display text-3xl md:text-4xl text-fg transition-all"
        style={{
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          textDecorationLine: "underline",
          textDecorationColor: "transparent",
          textDecorationThickness: "1.5px",
          textUnderlineOffset: "6px",
        }}
      >
        <span className="group-hover:[text-decoration-color:var(--color-accent)] group-hover:[text-underline-offset:10px] group-hover:text-accent transition-all">
          {guest.name}
        </span>
      </h3>
      <p className="mt-3 font-serif-body italic text-base text-fg-muted">
        {guest.role}
      </p>
    </Link>
  );
}
