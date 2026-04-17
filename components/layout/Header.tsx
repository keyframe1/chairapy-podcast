import Link from "next/link";
import Container from "../ui/Container";
import MobileNavToggle from "./MobileNavToggle";

const navLinks = [
  { href: "/episodes", label: "Episodes" },
  { href: "/guests", label: "Guests" },
  { href: "/about", label: "About" },
  { href: "/subscribe", label: "Subscribe" },
];

export default function Header() {
  return (
    <header className="relative border-b border-border bg-bg">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-2xl tracking-tight text-fg hover:text-accent transition-colors"
          >
            Chairapy
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-fg hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <MobileNavToggle />
        </div>
      </Container>
    </header>
  );
}
