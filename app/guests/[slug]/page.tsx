import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import Container from "../../../components/ui/Container";
import EpisodeCard from "../../../components/podcast/EpisodeCard";
import PlatformLink from "../../../components/podcast/PlatformLink";
import guestsData from "../../../content/guests.json";
import { getAllEpisodes } from "../../../lib/episodes";
import type { Guest } from "../../../lib/types";
import { SITE_URL } from "../../../lib/site";

const guests = guestsData as Guest[];

export function generateStaticParams() {
  return guests.map((g) => ({ slug: g.slug }));
}

function firstSentence(text: string): string {
  if (!text) return "";
  const trimmed = text.trim().replace(/\s+/g, " ");
  const match = trimmed.match(/^[^.!?]*[.!?]/);
  return (match ? match[0] : trimmed).trim();
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guest = guests.find((g) => g.slug === params.slug);
  if (!guest) return { title: "Guest" };

  const description = `${guest.role}. ${firstSentence(guest.bio)}`.slice(
    0,
    180,
  );
  const url = `${SITE_URL}/guests/${guest.slug}`;
  const heroImg = guest.heroImage?.src;

  return {
    title: guest.name,
    description,
    openGraph: {
      title: `${guest.name} · Guest on Eric's ADHD Experience`,
      description,
      url,
      type: "profile",
      images: heroImg
        ? [{ url: heroImg, alt: guest.heroImage!.alt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: guest.name,
      description,
      images: heroImg ? [heroImg] : undefined,
    },
    alternates: { canonical: url },
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
    guest.episodes.includes(ep.slug),
  );

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: guest.name,
    description: guest.bio,
    url: `${SITE_URL}/guests/${guest.slug}`,
    ...(guest.heroImage && { image: guest.heroImage.src }),
    ...(guest.location && { address: guest.location }),
  };

  const links = guest.links ?? {};
  const hasLinks = Boolean(
    links.website || links.instagram || links.linkedin,
  );
  const gallery = guest.gallery ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Hero — two modes depending on whether heroImage exists */}
      {guest.heroImage ? (
        <section className="relative">
          <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] min-h-[65vh]">
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[65vh] bg-bg-elevated">
              <Image
                src={guest.heroImage.src}
                alt={guest.heroImage.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-10 md:p-16">
              <Link
                href="/guests"
                className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors mb-10"
              >
                <span aria-hidden="true">←</span>
                <span>All guests</span>
              </Link>
              <p className="eyebrow eyebrow--accent">Guest</p>
              <h1
                className="mt-5 font-display text-fg"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.035em",
                }}
              >
                {guest.name}
              </h1>
              <p
                className="mt-4 font-serif-body italic text-xl md:text-2xl text-fg-muted max-w-[36ch]"
                style={{ lineHeight: 1.35 }}
              >
                {guest.role}
              </p>
              {guest.location && (
                <p className="mt-3 text-sm text-fg-muted tabular">
                  {guest.location.toUpperCase()}
                </p>
              )}
              {guest.heroImage.credit && (
                <p className="mt-6 text-xs text-fg-muted font-serif-body italic">
                  Photo: {guest.heroImage.credit}
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="pt-16 md:pt-24 pb-14 md:pb-20">
          <Container width="content">
            <Link
              href="/guests"
              className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors"
            >
              <span aria-hidden="true">←</span>
              <span>All guests</span>
            </Link>

            <p className="mt-12 eyebrow eyebrow--accent">Guest</p>
            <h1
              className="mt-6 font-display text-fg"
              style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              {guest.name}
            </h1>
            <p
              className="mt-6 font-serif-body italic text-2xl md:text-3xl text-fg-muted max-w-[38ch]"
              style={{ lineHeight: 1.3 }}
            >
              {guest.role}
            </p>
            {guest.location && (
              <p className="mt-4 eyebrow tabular">
                {guest.location.toUpperCase()}
              </p>
            )}
          </Container>
        </section>
      )}

      {/* Bio */}
      <section className="py-16 md:py-24">
        <Container width="content">
          <div
            className="prose-serif drop-cap text-fg"
            style={{ maxWidth: "64ch" }}
          >
            {guest.bio.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Container>
      </section>

      {/* On the show */}
      <section className="pb-16 md:pb-24">
        <Container width="content">
          <h2 className="eyebrow m-0">On the show</h2>
          {appearances.length > 0 ? (
            <ul className="mt-8 flex flex-col gap-5">
              {appearances.map((ep) => (
                <li key={ep.id}>
                  <EpisodeCard episode={ep} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 font-serif-body italic text-lg text-fg-muted">
              Episode linking in progress.
            </p>
          )}
        </Container>
      </section>

      {/* Gallery — only rendered if there's at least one image */}
      {gallery.length > 0 && (
        <section className="pb-16 md:pb-24">
          <Container>
            <h2 className="eyebrow m-0">In conversation</h2>
            <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gallery.map((img, i) => (
                <li key={`${img.src}-${i}`}>
                  <figure>
                    <div
                      className="relative aspect-[4/5] overflow-hidden bg-bg-elevated"
                      style={{
                        borderRadius: 2,
                        boxShadow:
                          "0 8px 24px rgba(193, 113, 68, 0.12)",
                      }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="mt-3 text-sm font-serif-body italic text-fg-muted">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Elsewhere — only rendered if at least one link exists */}
      {hasLinks && (
        <section className="pb-20 md:pb-28">
          <Container width="content">
            <h2 className="eyebrow m-0">Elsewhere</h2>
            <ul className="mt-6 flex flex-col space-y-3">
              {links.website && (
                <li>
                  <a
                    href={links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-fg hover:text-accent transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span className="text-sm">Website</span>
                  </a>
                </li>
              )}
              {links.instagram && (
                <li>
                  <PlatformLink platform="instagram" href={links.instagram} />
                </li>
              )}
              {links.linkedin && (
                <li>
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-fg hover:text-accent transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="#0A66C2"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                </li>
              )}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
