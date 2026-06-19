import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px", // yan reklam rayları yalnızca bu genişlikten itibaren
    },
    extend: {
      colors: {
        // "Next-gen" gaming paleti
        base: "#070912",
        surface: "#0e1120",
        card: "#141829",
        line: "#222842",
        neon: {
          DEFAULT: "#00e5ff",
          purple: "#a855f7",
          pink: "#ff2d75",
          lime: "#b6ff3b",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,229,255,.25), 0 8px 40px -8px rgba(0,229,255,.35)",
        "glow-purple": "0 0 0 1px rgba(168,85,247,.3), 0 8px 40px -8px rgba(168,85,247,.45)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(0,229,255,.12), transparent 60%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
