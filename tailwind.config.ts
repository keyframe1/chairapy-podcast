import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-elevated": "var(--color-bg-elevated)",
        "bg-dark": "var(--bg-dark)",
        "bg-card": "var(--bg-card)",
        fg: "var(--color-fg)",
        "fg-muted": "var(--color-fg-muted)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        sage: "var(--color-sage)",
        amber: "var(--color-amber)",
        border: "var(--color-border)",
        // Direct neon references for one-off accents
        acid: "var(--acid-green)",
        purple: "var(--electric-purple)",
        violet: "var(--deep-violet)",
        cyan: "var(--cyan)",
        magenta: "var(--hot-magenta)",
      },
      boxShadow: {
        "glow-green": "var(--glow-green)",
        "glow-green-strong": "var(--glow-green-strong)",
        "glow-purple": "var(--glow-purple)",
        "glow-cyan": "var(--glow-cyan)",
        "glow-magenta": "var(--glow-magenta)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        "serif-body": "var(--font-serif-body)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
        "6xl": "var(--text-6xl)",
        display: "var(--text-display)",
      },
      maxWidth: {
        site: "var(--max-width)",
        content: "var(--content-width)",
      },
    },
  },
  plugins: [],
};

export default config;
