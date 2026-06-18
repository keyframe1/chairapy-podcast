import { ReactNode } from "react";

type EmailSignupBlockProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Full-width block that frames an EmailSignup card against a soft neon glow
 * field — purple and cyan pools bleeding in from the corners — so the form
 * sits on the dark with a hint of the show's electric energy.
 */
export default function EmailSignupBlock({
  children,
  className = "",
}: EmailSignupBlockProps) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-lg border border-purple/30 ${className}`}
      style={{ isolation: "isolate" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(139,47,230,0.32), transparent 55%), radial-gradient(circle at 90% 85%, rgba(0,229,255,0.18), transparent 55%), var(--bg-card)",
        }}
      />
      <div className="px-6 py-10 md:px-10 md:py-14">{children}</div>
    </div>
  );
}
