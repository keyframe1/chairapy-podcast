import Link from "next/link";
import type { Guest } from "../../lib/types";

type GuestCardProps = {
  guest: Guest;
};

export default function GuestCard({ guest }: GuestCardProps) {
  return (
    <Link
      href={`/guests/${guest.slug}`}
      className="group block rounded-lg border border-border bg-bg-elevated p-6 transition-colors hover:border-accent"
    >
      <h3 className="font-display text-2xl text-fg group-hover:text-accent transition-colors">
        {guest.name}
      </h3>
      <p className="mt-2 text-sm text-fg-muted">{guest.headline}</p>
    </Link>
  );
}
