"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks: { href: string; label: string; badge?: string }[] = [
  { href: "/episodes", label: "Episodes" },
  { href: "/guests", label: "Guests" },
  { href: "/about", label: "About" },
  { href: "/watch", label: "Watch", badge: "Soon" },
  { href: "/subscribe", label: "Subscribe" },
];

export default function MobileNavToggle() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
        className="relative z-[60] p-2 -mr-2 text-fg hover:text-accent transition-colors"
      >
        {open ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-bg/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <div
            id="mobile-nav-panel"
            className="fixed inset-x-0 top-16 z-50 border-t border-border bg-bg-elevated shadow-xl"
          >
            <nav className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-4 text-lg text-fg hover:text-accent hover:bg-bg/40 transition-colors"
                >
                  <span className="inline-flex items-center gap-3">
                    {link.label}
                    {link.badge && (
                      <span className="eyebrow eyebrow--amber">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <span aria-hidden="true" className="text-accent">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
