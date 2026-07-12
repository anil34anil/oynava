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
        // ── CYBERPULSE — derin uzay + cam + neon ─────────────────────────
        // Renkler CSS değişkeninden okunur (globals.css): koyu tema :root'ta,
        // açık tema :root[data-theme="light"]'ta tanımlı → tema seçici tek
        // noktadan tüm siteyi değiştirir. "<alpha-value>" /60 gibi opaklıkları korur.
        base: "rgb(var(--c-base) / <alpha-value>)",     // arka plan
        surface: "rgb(var(--c-surface) / <alpha-value>)", // sidebar/header taban
        card: "rgb(var(--c-card) / <alpha-value>)",     // kart/konteyner
        line: "rgb(var(--c-line) / <alpha-value>)",     // kenarlık (outline)
        ink: "rgb(var(--c-ink) / <alpha-value>)",       // ana metin (on-surface)
        // text-white / bg-white/[x] kullanımları da temaya uysun diye "white"
        // değişkene bağlanır (koyu: gerçek beyaz, açık: koyu lacivert).
        white: "rgb(var(--c-white) / <alpha-value>)",

        // Vurgular (eski "neon" anahtarları korunur)
        neon: {
          DEFAULT: "rgb(var(--c-neon) / <alpha-value>)",       // elektrik moru (primary)
          purple: "rgb(var(--c-neon-purple) / <alpha-value>)", // koyu mor
          pink: "rgb(var(--c-neon-pink) / <alpha-value>)",     // hata/kırmızı
          lime: "rgb(var(--c-neon-lime) / <alpha-value>)",     // asit yeşili
        },
        secondary: "rgb(var(--c-secondary) / <alpha-value>)", // cyber mavi
        tertiary: "rgb(var(--c-neon-lime) / <alpha-value>)",  // asit yeşili

        // Mavimsi-soğuk metin ölçeği (açık temada ters çevrilir)
        slate: {
          50: "rgb(var(--c-slate-50) / <alpha-value>)",
          100: "rgb(var(--c-slate-100) / <alpha-value>)",
          200: "rgb(var(--c-slate-200) / <alpha-value>)",
          300: "rgb(var(--c-slate-300) / <alpha-value>)",
          400: "rgb(var(--c-slate-400) / <alpha-value>)",
          500: "rgb(var(--c-slate-500) / <alpha-value>)",
          600: "rgb(var(--c-slate-600) / <alpha-value>)",
          700: "rgb(var(--c-slate-700) / <alpha-value>)",
          800: "rgb(var(--c-slate-800) / <alpha-value>)",
          900: "rgb(var(--c-slate-900) / <alpha-value>)",
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
