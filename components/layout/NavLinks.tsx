"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

const NAV: NavItem[] = [
  { href: "/episodes", label: "Episodes" },
  { href: "/guests", label: "Guests" },
  { href: "/about", label: "About" },
  { href: "/subscribe", label: "Subscribe" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === pathname) return true;
  // Light up Episodes on /episodes/[slug], Guests on /guests/[slug], etc.
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-8">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`text-sm transition-colors ${
              active
                ? "text-accent"
                : "text-fg hover:text-accent"
            }`}
            style={
              active
                ? {
                    textDecoration: "underline",
                    textDecorationThickness: "1.5px",
                    textUnderlineOffset: "4px",
                  }
                : undefined
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
