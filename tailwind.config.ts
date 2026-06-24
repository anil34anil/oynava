import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    extend: {
      colors: {
        // ── CYBERPULSE (Stitch) — derin uzay + cam + neon ────────────────
        base: "#0b1326",     // arka plan (background/surface)
        surface: "#131b2e",  // sidebar/header taban (cam için /70 + blur)
        card: "#171f33",     // kart/konteyner
        line: "#2d3449",     // kenarlık (outline)
        ink: "#dae2fd",      // ana açık metin (on-surface, mavimsi beyaz)

        // Vurgular (eski "neon" anahtarları korunur)
        neon: {
          DEFAULT: "#d0bcff", // elektrik moru (primary)
          purple: "#a078ff",  // koyu mor (primary-container)
          pink: "#ffb4ab",    // hata/kırmızı (dislike)
          lime: "#90db00",    // asit yeşili (online/başarı = tertiary)
        },
        secondary: "#4cd7f6", // cyber mavi (bilgi/ikincil)
        tertiary: "#90db00",  // asit yeşili

        // Mavimsi-soğuk açık metin ölçeği (koyu tema)
        slate: {
          50: "#f3f5ff",
          100: "#e4e8fb",
          200: "#cbd2ec",
          300: "#aab3d4",
          400: "#8b93b0",
          500: "#6f7796",
          600: "#586079",
          700: "#414863",
          800: "#2d3449",
          900: "#1c2235",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"], // Sora
        body: ["var(--font-body)", "system-ui", "sans-serif"],       // Hanken Grotesk
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],     // JetBrains Mono
      },
      boxShadow: {
        glow: "0 0 20px rgba(208,188,255,.35)",            // mor bloom
        "glow-purple": "0 0 24px rgba(160,120,255,.45)",
        "glow-cyan": "0 0 18px rgba(76,215,246,.4)",
        "glow-green": "0 0 18px rgba(144,219,0,.4)",
      },
      backgroundImage: {
        "grid-fade": "radial-gradient(circle at 50% 0%, rgba(208,188,255,.16), transparent 60%)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
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
