import Link from "next/link";
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
    "About Eric's ADHD Experience. Long conversations with people who've lived something worth talking about. Recorded in Metairie, Louisiana.",
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
            Shot on Blackmagic 6K cameras.
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

      {/* 4. Full-width atmospheric transition band — neon glow strip */}
      <div className="relative w-full h-40 md:h-56 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 120% at 30% 50%, rgba(139,47,230,0.4), transparent 60%), radial-gradient(ellipse 50% 120% at 75% 50%, rgba(0,229,255,0.22), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--bg-black) 0%, transparent 35%, transparent 65%, var(--bg-black) 100%)",
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
            <p>Recorded in Metairie, Louisiana.</p>
          </div>
        </Container>
      </section>

      {/* Chairapy connection — kept as a subsection before the signup */}
      <section className="pb-20 md:pb-24">
        <Container width="content">
          <p className="eyebrow">The Chairapy connection</p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-10 items-start mt-5">
            <div className="prose-serif text-fg" style={{ maxWidth: "56ch" }}>
              <p>
                Chairapy is also a salon in Metairie. Same chair these
                conversations started in. If the show sounds like people talking
                honestly without much polish, that's the whole idea.
              </p>
              <p>
                <a
                  href="https://chairapy.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent editorial-link underline underline-offset-4"
                >
                  Visit chairapy.org →
                </a>
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
