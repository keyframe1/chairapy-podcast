import { ReactNode } from "react";

type EmailSignupBlockProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Full-width block that frames an EmailSignup card with the terracotta
 * Greek-key pattern at 8% opacity. Child renders on a solid cream card
 * so the form never competes with the pattern.
 */
export default function EmailSignupBlock({
  children,
  className = "",
}: EmailSignupBlockProps) {
  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ isolation: "isolate" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url(/images/brand/pattern-terra.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "280px 280px",
          opacity: 0.08,
          mixBlendMode: "multiply",
        }}
      />
      <div className="px-6 py-10 md:px-10 md:py-14">{children}</div>
    </div>
  );
}
