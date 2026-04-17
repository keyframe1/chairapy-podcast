"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/episodes", label: "Episodes" },
  { href: "/guests", label: "Guests" },
  { href: "/about", label: "About" },
  { href: "/subscribe", label: "Subscribe" },
];

export default function MobileNavToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="p-2 text-fg hover:text-accent transition-colors"
      >
        <span className="block w-6 h-0.5 bg-current mb-1.5" />
        <span className="block w-6 h-0.5 bg-current mb-1.5" />
        <span className="block w-6 h-0.5 bg-current" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 border-t border-border bg-bg-elevated">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-fg hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
