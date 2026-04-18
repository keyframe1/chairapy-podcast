import Link from "next/link";
import Image from "next/image";
import Container from "../../components/ui/Container";
import EricPhoto from "../../components/podcast/EricPhoto";
import EmailSignup from "../../components/podcast/EmailSignup";
import EmailSignupBlock from "../../components/podcast/EmailSignupBlock";
import HeroDiagonal from "../../components/podcast/HeroDiagonal";
import showInfoData from "../../content/show-info.json";
import type { ShowInfo } from "../../lib/types";

const showInfo = showInfoData as ShowInfo;

export const metadata = {
  title: "About",
  description:
    "About Eric's ADHD Experience — a podcast produced by Chairapy Media in New Orleans.",
};

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero — substrate treatment */}
      <HeroDiagonal scale="compact">
        <Container className="relative h-full">
          <div className="flex flex-col justify-center min-h-[46vh] md:min-h-[52vh] py-12">
            <p className="eyebrow">About the show</p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl text-fg"
              style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
            >
              The Show
            </h1>
            <p
              className="mt-5 font-serif-body italic text-xl md:text-2xl text-fg-muted max-w-content"
              style={{ lineHeight: 1.4 }}
            >
              {showInfo.showTagline}
            </p>
          </div>
        </Container>
      </HeroDiagonal>

      {/* 2. Immediate Eric — portrait first, name/pull quote right */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-[42fr_58fr] gap-10 md:gap-16 items-start">
            <div>
              <EricPhoto
                variant="portrait-01"
                alt={`${showInfo.hostName}, host of ${showInfo.showName}`}
                aspectRatio="4/5"
                treatment="portrait"
                priority
              />
            </div>
            <div className="md:pt-4">
              <p className="eyebrow">The host</p>
              <h2
                className="mt-5 font-display text-5xl md:text-6xl text-fg"
                style={{ lineHeight: 0.96, letterSpacing: "-0.035em" }}
              >
                {showInfo.hostName}
              </h2>
              <p className="mt-4 eyebrow tabular">
                {showInfo.hostLocation.toUpperCase()}
              </p>
              <blockquote
                className="mt-8 font-serif-body italic"
                style={{
                  fontSize: "var(--text-2xl)",
                  lineHeight: 1.35,
                  color: "var(--terracotta)",
                  maxWidth: "42ch",
                  letterSpacing: "-0.015em",
                }}
              >
                "{showInfo.hostShortBio}"
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Bio body — drop-cap, comfortable measure */}
      <section className="pb-20 md:pb-24">
        <Container width="content">
          <div className="prose-serif drop-cap text-fg" style={{ maxWidth: "62ch" }}>
            <p>{showInfo.hostLongBio}</p>
          </div>

          <p className="mt-10 text-sm text-fg-muted font-serif-body italic border-l-2 border-border pl-4">
            Recorded on professional broadcast equipment including Blackmagic
            6K cameras at studio-grade quality.
          </p>
        </Container>
      </section>

      {/* 3b. Marathon photo moment — visual beat between bio and show description */}
      <section className="pb-20 md:pb-28">
        <Container width="content">
          <figure>
            <EricPhoto
              variant="portrait-04"
              alt={`${showInfo.hostName} at the Crescent City Classic`}
              aspectRatio="3/4"
              treatment="portrait"
            />
            <figcaption
              className="mt-4 font-serif-body italic text-base text-fg-muted text-center"
              style={{ letterSpacing: "-0.005em" }}
            >
              Crescent City Classic. New Orleans.
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* 4. Full-width atmospheric transition band — the ex-sidebar accent */}
      <div className="relative w-full h-40 md:h-56 overflow-hidden" aria-hidden="true">
        <Image
          src="/images/brand/sidebar-accent-vertical.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ opacity: 0.25, mixBlendMode: "multiply" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--cream) 0%, transparent 30%, transparent 70%, var(--cream) 100%)",
          }}
        />
      </div>

      {/* 5. Show description */}
      <section className="py-20 md:py-28">
        <Container width="content">
          <p className="eyebrow">About the show</p>
          <h2
            className="mt-5 font-display text-4xl md:text-5xl text-fg"
            style={{ lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            What we do here.
          </h2>
          <div
            className="mt-10 prose-serif text-fg"
            style={{ maxWidth: "62ch" }}
          >
            <p>{showInfo.showDescriptionLong}</p>
            <p>
              The show is produced by {showInfo.productionLabel} in{" "}
              {showInfo.recordingLocation}.
            </p>
          </div>

          {/* 6. Phase 1 callout */}
          <p className="mt-10 text-sm text-fg-muted font-serif-body italic border-l-2 border-accent pl-4">
            Phase 1 branding — we're keeping the show name during the current
            engagement. Full rebrand coming later.
          </p>
        </Container>
      </section>

      {/* Chairapy connection — kept as a subsection before the signup */}
      <section className="pb-20 md:pb-24">
        <Container width="content">
          <p className="eyebrow">The Chairapy connection</p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-10 items-start mt-5">
            <div className="prose-serif text-fg" style={{ maxWidth: "56ch" }}>
              <p>
                This podcast is produced under the Chairapy brand, which also
                includes a full-service salon in Metairie. Same voice, same
                sensibility — people first, conversation over transaction, no
                polish where honesty will do.
              </p>
              <p>
                <Link
                  href="#"
                  className="text-accent editorial-link underline underline-offset-4"
                >
                  Visit chairapy.org →
                </Link>
              </p>
            </div>
            <EricPhoto
              variant="portrait-03"
              alt="Eric in a Chairapy t-shirt at the salon"
              aspectRatio="square"
            />
          </div>
        </Container>
      </section>

      {/* 7. Subscribe CTA block */}
      <section className="pb-20 md:pb-24">
        <Container width="content">
          <EmailSignupBlock>
            <EmailSignup
              headline="Follow the show."
              subheadline="New episodes land in your inbox, no spam."
            />
          </EmailSignupBlock>
        </Container>
      </section>

    </>
  );
}
