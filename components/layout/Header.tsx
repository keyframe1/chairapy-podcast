"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "../ui/Container";
import MobileNavToggle from "./MobileNavToggle";
import NavLinks from "./NavLinks";
import ShareButton from "./ShareButton";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 backdrop-blur ${
        scrolled
          ? "bg-bg/90 border-b border-purple/40"
          : "bg-bg/40 border-b border-transparent"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tight text-acid transition-[text-shadow] hover:[text-shadow:0_0_20px_rgba(57,255,20,0.6)]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Chairapy
          </Link>

          <div className="flex items-center gap-4 md:gap-8">
            <NavLinks />
            <ShareButton />
            <MobileNavToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
