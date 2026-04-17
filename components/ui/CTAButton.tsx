import Link from "next/link";
import { ReactNode } from "react";

type CTAButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function CTAButton({
  children,
  href,
  variant = "primary",
  external = false,
  disabled = false,
  className = "",
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium tracking-wide transition-colors";

  const variants: Record<string, string> = {
    primary: "bg-accent text-bg hover:bg-accent-hover",
    secondary:
      "border border-border text-fg hover:border-accent hover:text-accent",
  };

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`${base} opacity-50 cursor-not-allowed border border-border text-fg-muted ${className}`}
      >
        {children}
      </span>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
