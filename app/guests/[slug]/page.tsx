import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "../../../components/ui/Container";
import EpisodeListRow from "../../../components/podcast/EpisodeListRow";
import guestsData from "../../../content/guests.json";
import { getAllEpisodes } from "../../../lib/episodes";
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

  const allEpisodes = getAllEpisodes();
  const appearances = allEpisodes.filter((ep) =>
    guest.episodeIds.includes(ep.id),
  );

  return (
    <Container width="content">
      <div className="py-20 md:py-28">
        <Link
          href="/guests"
          className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors"
        >
          <span aria-hidden="true">←</span>
          <span>All guests</span>
        </Link>

        <header className="mt-10">
          <p className="eyebrow">Guest</p>
          <h1
            className="mt-4 font-display text-5xl md:text-6xl text-fg"
            style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
          >
            {guest.name}
          </h1>
          <p
            className="mt-6 font-serif-body italic text-xl text-fg-muted"
            style={{ lineHeight: 1.4 }}
          >
            {guest.headline}
          </p>
        </header>

        {guest.longBio && (
          <div
            className="mt-10 prose-serif text-fg"
            style={{ maxWidth: "68ch" }}
          >
            <p>{guest.longBio}</p>
          </div>
        )}

        <section className="mt-16">
          <h2 className="eyebrow mb-4 m-0">Appears in</h2>
          {appearances.length > 0 ? (
            <ul>
              {appearances.map((ep) => (
                <li key={ep.id}>
                  <EpisodeListRow episode={ep} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-serif-body italic text-lg text-fg-muted">
              Episode links are being added. Check back soon.
            </p>
          )}
        </section>

        {guest.externalLinks.length > 0 && (
          <section className="mt-16">
            <h2 className="eyebrow mb-4 m-0">Links</h2>
            <ul className="space-y-2">
              {guest.externalLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent editorial-link underline underline-offset-4"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Container>
  );
}
