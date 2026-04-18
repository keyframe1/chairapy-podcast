import Link from "next/link";
import Container from "../ui/Container";
import MobileNavToggle from "./MobileNavToggle";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-2xl tracking-tight text-fg hover:text-accent transition-colors"
            style={{
              fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              letterSpacing: "-0.02em",
            }}
          >
            Chairapy
          </Link>

          <NavLinks />

          <MobileNavToggle />
        </div>
      </Container>
    </header>
  );
}
