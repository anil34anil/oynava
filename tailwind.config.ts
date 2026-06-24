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
      "3xl": "1920px",
    },
    extend: {
      colors: {
        // ── Modern karanlık (CrazyGames tarzı) ──────────────────────────
        base: "#14161f",     // koyu antrasit-indigo — sayfa zemini
        surface: "#1a1c28",  // header/sidebar/yükseltilmiş yüzeyler
        card: "#1d2030",     // kart zemini
        line: "#2c3047",     // kenarlık
        ink: "#f5f6fc",      // açık başlık/önemli metin

        // Vurgu — menekşe/mor (eski "neon" anahtarları korunur)
        neon: {
          DEFAULT: "#7c6cff", // menekşe (birincil vurgu)
          purple: "#a855f7",  // mor (ikincil)
          pink: "#f472b6",    // pembe (favori/dislike)
          lime: "#fbbf24",    // kehribar (premium/jeton vurgusu)
        },

        // Koyu tema için açık metin ölçeği: düşük no = parlak/önemli, yüksek = soluk
        slate: {
          50: "#f8fafc",
          100: "#eef0f8",
          200: "#dfe2ee",
          300: "#c4c8da",
          400: "#9095ad",
          500: "#757a92",
          600: "#5d6175",
          700: "#474b5c",
          800: "#313443",
          900: "#20222e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 1px 2px rgba(0,0,0,.3), 0 10px 30px -12px rgba(124,108,255,.45)",
        "glow-purple": "0 1px 2px rgba(0,0,0,.3), 0 12px 34px -12px rgba(168,85,247,.5)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(124,108,255,.14), transparent 60%)",
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
