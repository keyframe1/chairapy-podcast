"use client";

import { useEffect } from "react";

/**
 * Global scroll-reveal observer. Any element carrying `data-reveal` fades
 * and rises into place the first time it enters the viewport. A single
 * IntersectionObserver watches them all; a MutationObserver re-arms new
 * nodes after client-side navigation (the layout never remounts). Honors
 * prefers-reduced-motion by leaving elements visible.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const arm = (root: ParentNode | Document = document) => {
      root
        .querySelectorAll?.("[data-reveal]:not(.is-revealed)")
        .forEach((el) => io.observe(el));
    };

    arm();

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const el = node as Element;
          if (el.matches?.("[data-reveal]")) io.observe(el);
          arm(el);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
