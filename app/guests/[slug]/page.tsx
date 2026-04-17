import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "../../../components/ui/Container";
import guestsData from "../../../content/guests.json";
import type { Guest } from "../../../lib/types";

const guests = guestsData as Guest[];

export function generateStaticParams() {
  return guests.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const guest = guests.find((g) => g.slug === params.slug);
  if (!guest) return { title: "Guest" };
  return {
    title: guest.name,
    description: guest.headline,
  };
}

export default function GuestDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const guest = guests.find((g) => g.slug === params.slug);
  if (!guest) notFound();

  return (
    <Container width="content">
      <div className="py-20 md:py-24">
        <Link
          href="/guests"
          className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          <span>All guests</span>
        </Link>

        <header className="mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
            Guest
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl text-fg">
            {guest.name}
          </h1>
          <p className="mt-4 text-base md:text-lg text-fg-muted">
            {guest.headline}
          </p>
        </header>

        {guest.longBio && (
          <div className="mt-10 space-y-5 text-base md:text-lg text-fg leading-relaxed">
            <p>{guest.longBio}</p>
          </div>
        )}

        {guest.externalLinks.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted">
              Links
            </h2>
            <ul className="mt-4 space-y-2">
              {guest.externalLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Container>
  );
}
