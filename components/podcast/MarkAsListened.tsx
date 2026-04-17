"use client";

import { useEffect } from "react";
import { addListened } from "../../lib/listening-progress";

export default function MarkAsListened({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    addListened(slug);
  }, [slug]);
  return null;
}
