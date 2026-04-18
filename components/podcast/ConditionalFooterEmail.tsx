"use client";

import { usePathname } from "next/navigation";
import EmailSignup from "./EmailSignup";
import EmailSignupBlock from "./EmailSignupBlock";

/**
 * Pages that carry a dedicated "Follow the show" email block in their own
 * body content. Footer suppresses its own email CTA on these pages so the
 * close of the page doesn't ask for the same address twice in 200px.
 */
const PAGES_WITH_FOLLOW_BLOCK = new Set<string>(["/", "/about", "/watch"]);

function pageHasFollowBlock(pathname: string): boolean {
  if (PAGES_WITH_FOLLOW_BLOCK.has(pathname)) return true;
  // Every individual episode detail page includes a signup card.
  // The /episodes list itself does not.
  if (pathname.startsWith("/episodes/") && pathname !== "/episodes") return true;
  return false;
}

export default function ConditionalFooterEmail() {
  const pathname = usePathname();
  if (pageHasFollowBlock(pathname)) return null;

  return (
    <div className="py-12 border-b border-border">
      <div className="max-w-content">
        <EmailSignupBlock>
          <EmailSignup variant="footer" />
        </EmailSignupBlock>
      </div>
    </div>
  );
}
